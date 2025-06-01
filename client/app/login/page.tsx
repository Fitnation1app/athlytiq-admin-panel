'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import logo from './logo.png';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  toast.dismiss();  // Clear all existing toasts before showing new ones

  try {
    const res = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('authToken', data.token);
      toast.success('Login successful! Redirecting...');
      router.push('/dashboard');
    } else {
      let data;
      try {
        data = await res.json();
      } catch {
        data = { detail: 'Unknown error' };
      }
      toast.error(data.detail || 'Login failed');
    }
  } catch (err) {
    toast.error('Failed to connect to server');
  }
};

  const handleForgotPass = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/forgot-pass');
  };

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="min-h-screen flex items-center justify-center bg-[#dbe6fb] px-4 py-12">
        <div className="bg-[#f0f4ff] rounded-xl max-w-md w-full p-10 shadow-lg relative z-10">
          <div className="flex justify-center mb-8">
            <Image
              src={logo}
              alt="Athlytiq Logo"
              width={100}
              height={64}
            />
          </div>
          <h2 className="text-center text-xl font-semibold mb-1 text-black">Admin Login</h2>
          <p className="text-center text-gray-600 mb-6">
            Hello, enter your details here to login into the dashboard.
          </p>
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {typeof error === "string"
                ? error
                : error.detail || JSON.stringify(error)}
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
    </>
  );
}
