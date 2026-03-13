"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password is required' }),
});

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
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
        localStorage.setItem('userToken', res.data.data.token);
        Cookies.set('token', res.data.data.token, { expires: 1 });
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials or error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 font-outfit">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-500">Sign in to your Big Bites account</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative text-sm font-medium">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Email</label>
          <div className="mt-1">
            <input
              {...register("email")}
              type="email"
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
                placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>}
          </div>
        </div>

        <div>
           <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <a href="#" className="font-medium text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">Forgot password?</a>
          </div>
          <div className="mt-1">
            <input
              {...register("password")}
              type="password"
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
               placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500">New to Big Bites? </span>
        <Link href="/register" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
          Create an account
        </Link>
      </div>
    </>
  );
}
