"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password must be 6+ characters' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' })
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    // TODO: Connect to actual backend API
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 font-outfit">Create Account</h2>
        <p className="mt-2 text-sm text-gray-500">Join Big Bites to order food</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1">
            <input
              {...register("name")}
              type="text"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
                placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="mt-1">
            <input
              {...register("email")}
              type="email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
                placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="mt-1 flex rounded-xl shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              +91
            </span>
            <input
              {...register("phone")}
              type="tel"
              className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-xl placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
                placeholder="9876543210"
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1">
            <input
              {...register("password")}
              type="password"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
               placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-70 mt-6"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500">Already have an account? </span>
        <Link href="/login" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
          Log In here
        </Link>
      </div>
    </>
  );
}
