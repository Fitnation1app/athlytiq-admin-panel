'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    router.push('/dashboard');
  };

  const handleForgotPass = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/forgot-pass');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbe6fb] px-4 py-12">
      <div className="bg-[#f0f4ff] rounded-xl max-w-md w-full p-10 shadow-lg relative z-10">
        <div className="flex items-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#007AFF"
            viewBox="0 0 24 24"
            className="w-8 h-8 mr-2"
          >
            <path d="M3 12L12 3l9 9-9 9-9-9z" />
          </svg>
          <span className="text-2xl font-semibold text-[#007AFF]">FitNation</span>
        </div>
        <h2 className="text-center text-xl font-semibold mb-1 text-black">Admin Login</h2>
        <p className="text-center text-gray-600 mb-6">
          Hello, enter your details here to login into the dashboard.
        </p>
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[##aab7b8]"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#aab7b8]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm font-semibold text-[#007AFF] hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPass}
              className="text-sm text-[#007AFF] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Button
          onClick={handleSubmit}
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Sign in
          </Button>
        </form>
      
      </div>
    </div>
  );
}