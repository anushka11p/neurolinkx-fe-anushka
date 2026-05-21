'use client';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        size={size}
        actions={[
          { label: 'Cancel', variant: 'ghost', onClick: () => setOpen(false) },
          { label: 'Confirm', variant: 'primary', onClick: () => setOpen(false) },
        ]}
      >
        <p className="text-[var(--color-text-secondary)]">
          Are you sure you want to update the shipment status? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const Small: Story = {
  render: () => <ModalDemo size="sm" />,
};

export const Large: Story = {
  render: () => <ModalDemo size="lg" />,
};

export const WithDangerAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete Shipment
        </Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Delete Shipment"
          actions={[
            { label: 'Cancel', variant: 'ghost', onClick: () => setOpen(false) },
            { label: 'Delete', variant: 'danger', onClick: () => setOpen(false) },
          ]}
        >
          <p className="text-[var(--color-text-secondary)]">
            This will permanently delete the shipment and all associated data.
          </p>
        </Modal>
      </div>
    );
  },
};
