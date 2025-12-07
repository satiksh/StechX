import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@stechx.com',
      role: 'ADMIN',
      provider: 'LOCAL',
      passwordHash: await bcrypt.hash('admin123', 10),
      isVerified: true,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });
  console.log(`✅ Created admin: ${admin.email}`);

  // Create sample clients
  const clients = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@company.com',
        role: 'CLIENT',
        provider: 'LOCAL',
        passwordHash: await bcrypt.hash('password123', 10),
        isVerified: true,
        bio: 'Founder of TechStartup Inc.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@business.com',
        role: 'CLIENT',
        provider: 'LOCAL',
        passwordHash: await bcrypt.hash('password123', 10),
        isVerified: true,
        bio: 'CTO at Digital Solutions',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
    }),
  ]);
  console.log(`✅ Created ${clients.length} clients`);

  // Create sample freelancers
  const freelancers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Sarah Developer',
        email: 'sarah@freelance.com',
        role: 'TALENT',
        provider: 'LOCAL',
        passwordHash: await bcrypt.hash('password123', 10),
        isVerified: true,
        bio: 'Full-stack web developer with 5+ years experience',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        hourlyRate: 75,
        rating: 4.8,
        totalReviews: 42,
        totalEarnings: 15000,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mike Designer',
        email: 'mike@creative.com',
        role: 'TALENT',
        provider: 'LOCAL',
        passwordHash: await bcrypt.hash('password123', 10),
        isVerified: true,
        bio: 'UI/UX Designer specialized in web and mobile',
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        hourlyRate: 65,
        rating: 4.9,
        totalReviews: 38,
        totalEarnings: 12000,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Emma Marketer',
        email: 'emma@marketing.com',
        role: 'TALENT',
        provider: 'LOCAL',
        passwordHash: await bcrypt.hash('password123', 10),
        isVerified: true,
        bio: 'Content marketing and SEO specialist',
        skills: ['SEO', 'Content Writing', 'Social Media', 'Analytics'],
        hourlyRate: 50,
        rating: 4.7,
        totalReviews: 31,
        totalEarnings: 8000,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      },
    }),
  ]);
  console.log(`✅ Created ${freelancers.length} freelancers`);

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Build E-Commerce Platform',
        description: 'Need a full-stack e-commerce platform with React frontend and Node.js backend. Include payment integration and inventory management.',
        category: 'Web Development',
        requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        budget: 5000,
        budgetType: 'fixed',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        clientId: clients[0].id,
        isUrgent: true,
        status: 'OPEN',
      },
    }),
    prisma.job.create({
      data: {
        title: 'Mobile App UI/UX Design',
        description: 'Design beautiful UI/UX for a fitness tracking mobile app. Need designs for iOS and Android.',
        category: 'Design',
        requiredSkills: ['Figma', 'UI Design', 'Mobile Design'],
        budget: 2000,
        budgetType: 'fixed',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        clientId: clients[1].id,
        status: 'OPEN',
      },
    }),
    prisma.job.create({
      data: {
        title: 'Content Writing for Tech Blog',
        description: 'Write 10 high-quality blog posts about web development technologies. 2000+ words each.',
        category: 'Writing',
        requiredSkills: ['Technical Writing', 'SEO', 'Content Marketing'],
        budget: 1500,
        budgetType: 'fixed',
        clientId: clients[0].id,
        status: 'OPEN',
      },
    }),
  ]);
  console.log(`✅ Created ${jobs.length} jobs`);

  // Create sample proposals
  const proposals = await Promise.all([
    prisma.proposal.create({
      data: {
        jobId: jobs[0].id,
        freelancerId: freelancers[0].id,
        coverLetter: 'I am an experienced full-stack developer with 5+ years in building e-commerce platforms. I have successfully delivered 15+ projects similar to this one.',
        proposedBudget: 4800,
        estimatedDays: 45,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    }),
    prisma.proposal.create({
      data: {
        jobId: jobs[1].id,
        freelancerId: freelancers[1].id,
        coverLetter: 'I specialize in mobile app design and have created designs for 20+ apps. I can deliver high-quality designs for both iOS and Android platforms.',
        proposedBudget: 1800,
        estimatedDays: 10,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    }),
  ]);
  console.log(`✅ Created ${proposals.length} proposals`);

  // Create sample contract
  const contract = await prisma.contract.create({
    data: {
      jobId: jobs[0].id,
      clientId: clients[0].id,
      freelancerId: freelancers[0].id,
      amount: 4800,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      terms: 'Payment upon milestone completion',
    },
  });
  console.log(`✅ Created contract: ${contract.id}`);

  // Update job status to IN_PROGRESS
  await prisma.job.update({
    where: { id: jobs[0].id },
    data: { status: 'IN_PROGRESS', assignedFreelancerId: freelancers[0].id, progress: 30 },
  });

  // Create conversation
  const conversation = await prisma.conversation.create({
    data: {
      participantIds: [clients[0].id, freelancers[0].id],
      jobId: jobs[0].id,
    },
  });

  // Create sample messages
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: clients[0].id,
      recipientId: freelancers[0].id,
      content: 'Hi Sarah! Great proposal. Can we schedule a call to discuss the timeline?',
      status: 'DELIVERED',
      jobId: jobs[0].id,
    },
  });
  console.log('✅ Created sample messages');

  // Create sample reviews
  await prisma.review.create({
    data: {
      contractId: contract.id,
      reviewerId: clients[0].id,
      revieweeId: freelancers[0].id,
      rating: 5,
      comment: 'Excellent work! Sarah delivered the project on time with great quality.',
    },
  });
  console.log('✅ Created sample review');

  // Create sample notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: clients[0].id,
        type: 'proposal',
        title: 'New Proposal',
        message: 'Sarah Developer submitted a proposal for your project',
        data: { jobId: jobs[0].id },
      },
    }),
    prisma.notification.create({
      data: {
        userId: freelancers[0].id,
        type: 'job_post',
        title: 'New Job Posted',
        message: 'A new job matching your skills: Build E-Commerce Platform',
        data: { jobId: jobs[0].id },
      },
    }),
  ]);
  console.log('✅ Created sample notifications');

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\nTest Accounts:');
  console.log('Admin: admin@stechx.com / admin123');
  console.log('Client: alice@company.com / password123');
  console.log('Freelancer: sarah@freelance.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
