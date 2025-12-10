# 🧪 Complete Testing Guide for StechX Platform

## ✅ Pre-Testing Checklist

- [x] Development server running on http://localhost:3000
- [x] Database connected to Railway PostgreSQL
- [x] Environment variables configured (.env.local)
- [x] JWT_SECRET added for authentication
- [x] Turbopack warning fixed in next.config.ts
- [x] All TypeScript errors resolved
- [x] Duplicate files cleaned up

---

## 🎯 Test Scenarios

### 1. Authentication & Authorization

#### A. Sign Up - FREELANCER
1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Fill in the form:
   - Name: `John Freelancer`
   - Email: `john@freelancer.com`
   - Password: `Test1234!`
   - Role: Select **FREELANCER**
4. Click "Sign Up"
5. ✅ **Expected**: Redirected to `/dashboard/freelancer` with welcome message
6. ✅ **Expected**: See "Welcome back, John Freelancer! 👋"

#### B. Sign Up - CLIENT
1. Open new incognito/private window
2. Go to http://localhost:3000
3. Click "Sign Up"
4. Fill in:
   - Name: `Jane Client`
   - Email: `jane@client.com`
   - Password: `Test1234!`
   - Role: Select **CLIENT**
5. Click "Sign Up"
6. ✅ **Expected**: Redirected to `/dashboard/client`
7. ✅ **Expected**: See client dashboard with "Post New Project" section

#### C. Sign Up - ADMIN
1. Open another incognito window
2. Go to http://localhost:3000
3. Sign up as:
   - Name: `Admin User`
   - Email: `admin@stechx.com`
   - Password: `Admin1234!`
   - Role: Select **ADMIN** (if available, otherwise create via database)
4. ✅ **Expected**: Redirected to `/dashboard/admin`
5. ✅ **Expected**: See User Management, Contract Approval, Statistics

#### D. Google OAuth (Optional)
1. Click "Continue with Google"
2. Select Google account
3. ✅ **Expected**: Redirected based on role in database

#### E. Sign In
1. Log out (clear localStorage or close window)
2. Go to http://localhost:3000
3. Click "Sign In"
4. Enter credentials from above
5. ✅ **Expected**: Redirected to correct dashboard based on role

---

### 2. Client Workflow

#### A. Post a Project
1. Login as `jane@client.com` (CLIENT)
2. Go to `/dashboard/client`
3. Scroll to "Post New Project" section
4. Fill in the form:
   - **Title**: `E-commerce Website Development`
   - **Category**: `Web Development`
   - **Description**: `Need a modern e-commerce website with payment integration, user authentication, and admin dashboard.`
   - **Budget**: Select preset `$5000-$10000` OR enter custom `7500`
   - **Skills**: `React, Node.js, PostgreSQL, Stripe`
   - **Week Deadline**: `4`
   - Check **Urgent** if needed
5. Click "Post Project"
6. ✅ **Expected**: Success message "Project posted successfully!"
7. ✅ **Expected**: Project appears in "My Projects" section
8. ✅ **Expected**: Shows "0 bids" initially
9. ✅ **Expected**: Max Bid Price = 80% of budget (e.g., $6,000 for $7,500 budget)

#### B. View Bids on Project
1. Wait for freelancers to place bids (or continue to Freelancer workflow)
2. In "My Projects" section, click on the project
3. ✅ **Expected**: See list of bids with:
   - Freelancer name
   - Bid amount
   - Proposed days
   - Cover letter
   - "Accept Bid" button

#### C. Accept a Bid
1. Review the bids
2. Click "Accept Bid" on your preferred freelancer
3. ✅ **Expected**: Confirmation dialog appears
4. Confirm acceptance
5. ✅ **Expected**: Bid status changes to "WON"
6. ✅ **Expected**: Job status changes to "BID_WON"
7. ✅ **Expected**: Other bids marked as "LOST"
8. ✅ **Expected**: Freelancer has 24 hours to accept

---

### 3. Freelancer Workflow

#### A. Browse Available Projects
1. Login as `john@freelancer.com` (FREELANCER)
2. Go to `/dashboard/freelancer`
3. Scroll to "Available Projects" section
4. ✅ **Expected**: See the project posted by client
5. ✅ **Expected**: See budget, max bid (80%), skills, deadline
6. ✅ **Expected**: See client name and rating
7. ✅ **Expected**: See number of bids

#### B. Place a Bid
1. Click "Place Bid" on a project
2. Modal opens with project details
3. Fill in:
   - **Bid Amount**: `5500` (must be ≤ $6,000 max bid)
   - **Estimated Days**: `25`
   - **Cover Letter**: `I have 5+ years of experience building e-commerce platforms with React and Node.js. I've integrated Stripe payment gateways in multiple projects...`
4. Click "Submit Bid"
5. ✅ **Expected**: Success message "Bid placed successfully! 🎉"
6. ✅ **Expected**: Modal closes
7. ✅ **Expected**: Bid appears in "My Bids" section with status "PENDING"

#### C. Test 80% Validation
1. Try to place another bid on different project
2. Enter bid amount > 80% of budget (e.g., $8,000 for $7,500 budget)
3. Click "Submit Bid"
4. ✅ **Expected**: Error message "Your bid cannot exceed $6,000 (80% of the budget)"

#### D. Accept Won Bid (after client accepts)
1. Wait for client to accept your bid
2. Go to "My Bids" section
3. ✅ **Expected**: Bid status shows "WON"
4. ✅ **Expected**: See countdown timer "Accept by: [24 hours from now]"
5. ✅ **Expected**: See "Accept" and "Reject" buttons
6. Click "Accept"
7. Confirm in dialog
8. ✅ **Expected**: Success message "Project accepted! Contract created and sent to admin for approval. 🎉"
9. ✅ **Expected**: Bid status changes to "ACCEPTED"
10. ✅ **Expected**: Contract created with 30% advance amount
11. ✅ **Expected**: Contract status: "PENDING_ADMIN_APPROVAL"

#### E. Reject Won Bid
1. Alternatively, click "Reject"
2. Enter reason in prompt: `Not available at this time due to other commitments`
3. ✅ **Expected**: Warning "Bid rejected. Your profile rating has been affected."
4. ✅ **Expected**: Profile rating decreased by 0.5
5. ✅ **Expected**: Rejection count incremented
6. ✅ **Expected**: Job reopens for bidding

---

### 4. Admin Workflow

#### A. View All Users
1. Login as `admin@stechx.com` (ADMIN)
2. Go to `/dashboard/admin`
3. View "User Management" section
4. ✅ **Expected**: See all registered users (John Freelancer, Jane Client, Admin)
5. ✅ **Expected**: See role, email, join date, status for each user

#### B. Suspend/Unsuspend User
1. Find a user in the list
2. Click "Suspend"
3. ✅ **Expected**: User status changes to "SUSPENDED"
4. ✅ **Expected**: Button changes to "Unsuspend"
5. Click "Unsuspend"
6. ✅ **Expected**: User status changes back to "ACTIVE"

#### C. Review Pending Contracts
1. Scroll to "Contract Approval" section
2. ✅ **Expected**: See contract created by freelancer
3. ✅ **Expected**: See:
   - Client name: Jane Client
   - Freelancer name: John Freelancer
   - Project title: E-commerce Website Development
   - Total amount: $5,500
   - 30% Advance: $1,650
   - Status: PENDING_ADMIN_APPROVAL

#### D. Approve Contract
1. Click "Approve Contract"
2. ✅ **Expected**: Success message
3. ✅ **Expected**: Contract status changes to "PENDING_CLIENT_APPROVAL"
4. ✅ **Expected**: Google Meet link added (e.g., `https://meet.google.com/abc-defg-hij`)
5. ✅ **Expected**: Escrow payment created for $1,650 (30% advance)
6. ✅ **Expected**: Notifications sent to client and freelancer

#### E. View Platform Statistics
1. Scroll to "Platform Statistics" section
2. ✅ **Expected**: See:
   - Total Users count
   - Active Projects count
   - Total Revenue (sum of all contract amounts)
   - Pending Contracts count

---

### 5. Contract Signing Workflow

#### A. Client Signs Contract
1. Login as `jane@client.com` (CLIENT)
2. Go to dashboard contracts section (if exists) or via notification
3. View contract details
4. Click "Sign Contract"
5. ✅ **Expected**: `signedByClient` timestamp recorded
6. ✅ **Expected**: Contract still "PENDING_CLIENT_APPROVAL" (waiting for freelancer)

#### B. Freelancer Signs Contract
1. Login as `john@freelancer.com` (FREELANCER)
2. View contract
3. Click "Sign Contract"
4. ✅ **Expected**: `signedByFreelancer` timestamp recorded
5. ✅ **Expected**: Contract status changes to "ACTIVE"
6. ✅ **Expected**: Job status changes to "IN_PROGRESS"
7. ✅ **Expected**: Both parties can see Google Meet link

---

### 6. Edge Cases & Error Handling

#### A. Duplicate Bid Prevention
1. Login as FREELANCER
2. Place a bid on a project
3. Try to place another bid on the same project
4. ✅ **Expected**: Error "You have already placed a bid on this job"

#### B. Invalid Role Access
1. Login as CLIENT
2. Try to access `/dashboard/freelancer`
3. ✅ **Expected**: Redirected to `/dashboard/client`

#### C. Unauthorized API Calls
1. Open browser console
2. Try to call API without token:
   ```javascript
   fetch('http://localhost:3000/api/projects').then(r => r.json()).then(console.log)
   ```
3. ✅ **Expected**: 401 Unauthorized or "No token provided" error

#### D. Bid After Deadline
1. Wait for 24 hours after bid acceptance (or manually change `acceptanceDeadline` in DB)
2. Try to accept the won bid
3. ✅ **Expected**: Error "Acceptance deadline has passed"

#### E. Budget Validation
1. Create project with custom budget: `5000`
2. ✅ **Expected**: `maxBidPrice` auto-calculated as `4000` (80%)
3. Try to bid `4500`
4. ✅ **Expected**: Error "Your bid cannot exceed $4,000"

---

## 🔍 Database Verification (Optional)

If you want to verify data in Railway PostgreSQL:

### Connect to Database
```bash
cd /Users/satikshpatel/stechx
npx prisma studio
```

### Check Tables
1. **User**: Verify all registered users exist
2. **Job**: Check project details, budget, maxBidPrice
3. **Bid**: Verify bid amounts, status, acceptanceDeadline
4. **Contract**: Check advanceAmount (30%), Google Meet link
5. **Payment**: Verify escrow payment created after admin approval
6. **Notification**: Check notifications sent to users

---

## 📊 Performance Checklist

- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] Smooth navigation between dashboards
- [ ] No console errors
- [ ] Responsive design on mobile/tablet
- [ ] Forms validate correctly
- [ ] Modals open/close smoothly

---

## 🐛 Common Issues & Fixes

### Issue 1: "Load failed" Error
- **Fix**: Already resolved - role type mismatch fixed

### Issue 2: API returns 401 Unauthorized
- **Fix**: Check JWT token in localStorage: `localStorage.getItem('token')`
- Clear and re-login if token expired

### Issue 3: Database connection error
- **Fix**: Verify DATABASE_URL in `.env.local` is correct
- Check Railway database is running

### Issue 4: Google OAuth not working
- **Fix**: Verify NEXT_PUBLIC_GOOGLE_CLIENT_ID is set
- Check OAuth consent screen in Google Cloud Console

---

## ✅ Final Verification

After completing all tests above, verify:

1. ✅ All user roles work correctly
2. ✅ Project posting and budget selection working
3. ✅ Bid placement with 80% validation working
4. ✅ Bid acceptance (client side) working
5. ✅ Bid acceptance/rejection (freelancer side) working
6. ✅ Contract creation (30% advance) working
7. ✅ Admin approval with Google Meet working
8. ✅ Contract signing workflow working
9. ✅ User management (suspend/unsuspend) working
10. ✅ Platform statistics accurate

---

## 🚀 Next Steps After Testing

1. **Report any bugs found** during testing
2. **Document feature requests** for enhancements
3. **Test on different browsers** (Chrome, Firefox, Safari, Edge)
4. **Test on mobile devices** (iOS, Android)
5. **Prepare for production deployment** (Vercel, Railway, etc.)
6. **Set up monitoring** (Sentry, LogRocket, etc.)
7. **Configure email notifications** (SendGrid, Resend, etc.)
8. **Add payment integration** (Stripe, PayPal for actual escrow)

---

**Happy Testing! 🎉**

If you encounter any issues, check:
1. Browser console for errors
2. Network tab for API failures
3. `npm run dev` terminal for server errors
4. Database using Prisma Studio

**All systems are GO! ✅**
