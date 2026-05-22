'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea } from '@/app/components/ui/FormFields';
import Button from '@/app/components/ui/Button';
import { Switch } from '@/app/components/ui/FormFields';
import { toast } from '@/app/components/ui/Toast';
import { useState } from 'react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  bio: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Anushka Prasad',
      email: 'demo@neurolinkx.com',
      bio: 'Frontend Developer',
    },
  });

  const onSubmit = (data: ProfileData) => {
    console.log(data);
    toast.success('Profile updated successfully!');
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Section */}
      <section className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xl font-bold overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              'A'
            )}
          </div>
          <div>
            <label
              htmlFor="avatar"
              className="cursor-pointer text-sm text-[var(--color-primary)] hover:underline"
            >
              Upload new photo
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Full Name"
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />
          <Textarea
            id="bio"
            label="Bio"
            placeholder="Tell us about yourself..."
            {...register('bio')}
          />
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </section>

      {/* Notifications Section */}
      <section className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">
          Notifications
        </h2>
        <div className="flex flex-col gap-4">
          <Switch label="Email notifications" checked={emailNotifs} onChange={setEmailNotifs} />
          <Switch label="Push notifications" checked={pushNotifs} onChange={setPushNotifs} />
        </div>
      </section>

      {/* Team Members Section */}
      <section className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Team Members</h2>
          <Button size="sm" onClick={() => toast.info('Invite email sent! (mock)')}>
            Invite member
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { name: 'Anushka Prasad', email: 'demo@neurolinkx.com', role: 'Admin' },
            { name: 'Rahul Sharma', email: 'rahul@neurolinkx.com', role: 'Member' },
            { name: 'Priya Singh', email: 'priya@neurolinkx.com', role: 'Member' },
          ].map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-sm font-medium text-[var(--color-text-primary)]">
                  {member.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {member.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">{member.email}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
