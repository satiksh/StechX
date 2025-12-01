'use client';

import { useState } from 'react';
import { submitTalentApplication } from '@/lib/api';

export default function TalentPage() {
  const [formData, setFormData] = useState({
    position: 'WebDev',
    portfolioUrl: '',
    experience: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const result = await submitTalentApplication(formData);

    if (result.error) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      setStatus('success');
      setFormData({ position: 'WebDev', portfolioUrl: '', experience: '' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-slate-900 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          Join StechX as Talent
        </h1>
        <p className="text-neutral-400 text-center mb-8">
          Apply to work on exciting projects with top startups and creators.
        </p>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 backdrop-blur-sm p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition"
            >
              <option value="WebDev">Web Developer</option>
              <option value="AppDev">App Developer</option>
              <option value="VideoEditor">Video Editor</option>
              <option value="AISpecialist">AI Specialist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Portfolio URL</label>
            <input
              type="url"
              required
              placeholder="https://yourportfolio.com"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Experience & Skills</label>
            <textarea
              required
              rows={6}
              placeholder="Tell us about your experience, skills, and why you want to join StechX..."
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-sky-500 focus:outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Application'}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-center text-sm">
              ✅ Application submitted successfully! We'll review it and get back to you.
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
