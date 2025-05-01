"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        icon: '🔒',
      });
      return;
    }

    setIsLoading(true);

    const signUpPromise = fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to register');
      }
      return response.json();
    });

    toast.promise(
      signUpPromise,
      {
        loading: 'Creating your account...',
        success: () => {
          router.push('/auth/signin?registered=true');
          return '🎉 Account created successfully!';
        },
        error: (err) => `❌ ${err.message}`,
      },
      {
        success: {
          duration: 3000,
        },
      }
    ).catch(() => {
      setIsLoading(false);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-orbitron text-white mb-2">Create Account</h2>
          <p className="text-gray-400 font-rajdhani">
            Join CodeNest to share and discover code snippets
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              placeholder="Create a password"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              placeholder="Confirm your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500/20 text-cyan-300 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 