'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/app/components/ui/FormFields';
import Button from '@/app/components/ui/Button';
import { toast } from '@/app/components/ui/Toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success('Reset link sent! Check your email.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">NEUROLINKX</h1>
        </div>

        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Reset your password
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              required
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            <a href="/login" className="text-[var(--color-primary)] hover:underline">
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
