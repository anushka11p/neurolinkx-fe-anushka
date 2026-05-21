'use client';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Select, Checkbox, RadioGroup, Switch } from './FormFields';
import Button from './Button';

const meta: Meta = {
  title: 'UI/FormFields',
};
export default meta;
type Story = StoryObj;

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.string().min(1, 'Please select a status'),
  notes: z.string().optional(),
  notify: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export const FullForm: Story = {
  render: () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(schema),
    });
    const onSubmit = (data: FormData) => alert(JSON.stringify(data, null, 2));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md p-6">
        <Input
          id="name"
          label="Full Name"
          required
          placeholder="Anushka Prasad"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          required
          placeholder="anushka@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          id="status"
          label="Status"
          required
          placeholder="Select a status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'delayed', label: 'Delayed' },
          ]}
          error={errors.status?.message}
          {...register('status')}
        />
        <Textarea
          id="notes"
          label="Notes"
          placeholder="Any additional notes..."
          {...register('notes')}
        />
        <Checkbox id="notify" label="Notify me about updates" {...register('notify')} />
        <Button type="submit">Submit</Button>
      </form>
    );
  },
};

export const SwitchDemo: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <div className="p-6 flex flex-col gap-4">
        <Switch label="Enable notifications" checked={on} onChange={setOn} />
        <Switch label="Dark mode" checked={true} onChange={() => {}} />
        <Switch label="Disabled switch" checked={false} disabled />
      </div>
    );
  },
};

export const RadioDemo: Story = {
  render: () => {
    const [val, setVal] = useState('standard');
    return (
      <div className="p-6">
        <RadioGroup
          name="shipping"
          label="Shipping Method"
          value={val}
          onChange={setVal}
          options={[
            { value: 'standard', label: 'Standard (5-7 days)' },
            { value: 'express', label: 'Express (2-3 days)' },
            { value: 'overnight', label: 'Overnight' },
          ]}
        />
      </div>
    );
  },
};

export const WithErrors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md p-6">
      <Input
        id="err-name"
        label="Name"
        error="This field is required"
        value=""
        onChange={() => {}}
      />
      <Select
        id="err-status"
        label="Status"
        error="Please select a status"
        options={[{ value: 'active', label: 'Active' }]}
        placeholder="Select..."
      />
      <Textarea
        id="err-notes"
        label="Notes"
        error="Notes are too short"
        value=""
        onChange={() => {}}
      />
    </div>
  ),
};
