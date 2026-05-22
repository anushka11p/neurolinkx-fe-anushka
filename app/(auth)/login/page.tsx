'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/app/components/ui/FormFields';
import Button from '@/app/components/ui/Button';
import { toast } from '@/app/components/ui/Toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">NEUROLINKX</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
            Shipment Tracking Dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              placeholder="demo@neurolinkx.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-[var(--color-primary)] hover:underline">
              Sign up
            </a>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)]">
            <p className="text-xs text-[var(--color-text-muted)] text-center">
              Demo: demo@neurolinkx.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
