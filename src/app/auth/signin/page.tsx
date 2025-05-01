"use client";

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Github, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Show success message if user just registered
  const justRegistered = searchParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/snippets');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    try {
      setSocialLoading(provider);
      await signIn(provider, { callbackUrl: '/snippets' });
    } catch (err) {
      setError('Failed to sign in with ' + provider);
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-orbitron text-white mb-2">Sign In</h2>
        <p className="text-gray-400 font-rajdhani">
          Sign in to interact with code snippets
        </p>
        {justRegistered && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-300 rounded-lg">
            Account created successfully! Please sign in.
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={() => handleSocialSignIn('github')}
          disabled={!!socialLoading}
        >
          <Github className="h-5 w-5" />
          {socialLoading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
        </button>

        <button
          className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={() => handleSocialSignIn('google')}
          disabled={!!socialLoading}
        >
          <Mail className="h-5 w-5" />
          {socialLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">Or continue with</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !!socialLoading}
          className="w-full bg-cyan-500/20 text-cyan-300 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
} 