'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/config';
import { GoogleLogin } from '@react-oauth/google';

type UserRole = 'freelancer' | 'client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
}

export default function EnhancedNavbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openAuthModal = (mode: 'signin' | 'signup', role?: UserRole) => {
    setAuthMode(mode);
    if (role) {
      setSelectedRole(role);
      setIsAuthModalOpen(true);
    } else {
      setIsRoleSelectionOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setIsRoleSelectionOpen(false);
    setIsAuthModalOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="stechx-nav">
        <div className="stechx-nav-inner">
          {/* Logo */}
          <Link href="/" className="stechx-brand">
            <div className="stechx-logo-box">
              <Image
                src="/images/stxlogo.png"
                alt="STech-X"
                width={32}
                height={32}
                className="stechx-logo-img"
              />
            </div>
            <span className="stechx-brand-text">STech-X</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="stechx-burger" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Links */}
          <div className={`stechx-nav-links ${isMobileMenuOpen ? 'stechx-nav-links-open' : ''}`}>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            <div className="stechx-nav-divider"></div>
            <button
              onClick={() => openAuthModal('signin')}
              className="stechx-nav-secondary"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="stechx-nav-primary"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Role Selection Modal */}
      {isRoleSelectionOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your Role
              </h2>
              <p className="text-gray-600">
                How would you like to use STech-X?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Freelancer/Agency Option */}
              <button
                onClick={() => handleRoleSelection('freelancer')}
                className="group p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition">
                    <svg className="w-10 h-10 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Freelancer / Agency
                  </h3>
                  <p className="text-gray-600 text-sm">
                    I want to provide services and work on projects
                  </p>
                </div>
              </button>

              {/* Client Option */}
              <button
                onClick={() => handleRoleSelection('client')}
                className="group p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition">
                    <svg className="w-10 h-10 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Client / Startup Owner
                  </h3>
                  <p className="text-gray-600 text-sm">
                    I want to hire talent and get services
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setIsRoleSelectionOpen(false)}
              className="mt-6 w-full py-3 text-gray-600 hover:text-gray-900 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && selectedRole && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setSelectedRole(null);
          }}
          mode={authMode}
          role={selectedRole}
        />
      )}
    </>
  );
}

interface AuthModalPropsExtended extends AuthModalProps {
  role: UserRole;
}

function AuthModal({ isOpen, onClose, mode, role }: AuthModalPropsExtended) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [switchMode, setSwitchMode] = useState(false);

  // Use the backend base URL (Render/local) rather than Next.js API routes.
  // This keeps auth flows consistent with `AuthContext`.
  const apiBaseUrl = API_BASE_URL;

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role: role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token and redirect based on role
        localStorage.setItem('token', data.token);
        window.location.href = role === 'client' ? '/dashboard/client' : '/dashboard/freelancer';
      }
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const endpoint = mode === 'signin' ? `${apiBaseUrl}/auth/login` : `${apiBaseUrl}/auth/register`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          ...(mode === 'signup' && { name }),
          role: role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = role === 'client' ? '/dashboard/client' : '/dashboard/freelancer';
      } else {
        const error = await response.json();
        alert(error.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const roleTitle = role === 'freelancer' ? 'Freelancer/Agency' : 'Client';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'} as {roleTitle}
          </h2>
          <p className="text-gray-600 text-sm">
            {mode === 'signin' 
              ? 'Welcome back! Sign in to continue' 
              : 'Create your account to get started'}
          </p>
        </div>

        {/* Google Sign In */}
        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
            theme="outline"
            size="large"
            text={mode === 'signin' ? 'signin_with' : 'signup_with'}
            width="100%"
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
