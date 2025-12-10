import type { Metadata } from "next";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "STech-X - Transparent Marketplace for Technology Services",
  description: "Connect with top freelancers and agencies for your tech projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <AuthProvider>
            <EnhancedNavbar />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
