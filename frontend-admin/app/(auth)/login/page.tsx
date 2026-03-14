"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Store, Loader2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError('');

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const baseUrl = rawApiUrl.replace(/\/$/, '');
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const res = await axios.post(`${apiUrl}/auth/login`, {
        email: data.email,
        password: data.password
      });

      if (res.data.success) {
        // Store token in cookie and localstorage for compatibility
        localStorage.setItem('adminToken', res.data.data.token);
        Cookies.set('token', res.data.data.token, { expires: 1 });
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error full details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      });
      
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Cannot reach the backend server. Is it running?');
      } else {
        setError(err.response?.data?.error || 'Invalid credentials or error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypass = () => {
    setIsLoading(true);
    // Set a dummy token for bypass mode
    const dummyToken = 'bypass-token';
    localStorage.setItem('adminToken', dummyToken);
    Cookies.set('token', dummyToken, { expires: 1 });
    
    // Brief delay for UX feedback then redirect
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-lg">
          <Store className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-poppins">
        Big Bites Admin
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Sign in to manage your platform
      </p>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm`}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">For Debugging Only</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleBypass}
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-70"
              >
                Direct Access (Skip Credentials)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
