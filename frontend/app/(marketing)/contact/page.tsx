'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Web',
    budget: 0,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const result = await submitContactForm(formData);

    if (result.error) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      setStatus('success');
      setFormData({ name: '', email: '', projectType: 'Web', budget: 0, message: '' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-slate-900 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-neutral-400 text-center mb-8">
          Tell us about your project and we'll get back to you soon.
        </p>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 backdrop-blur-sm p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Type</label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition"
            >
              <option value="Web">Web Development</option>
              <option value="App">App Development</option>
              <option value="Video">Video Editing</option>
              <option value="AI">AI Automation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget (USD)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-center text-sm">
              ✅ Message sent successfully! We'll get back to you soon.
            </p>
          )}

          {status === 'error' && (
            <p className="text-red-400 text-center text-sm">
              ❌ {errorMessage}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
