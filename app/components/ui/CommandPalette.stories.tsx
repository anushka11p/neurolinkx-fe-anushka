'use client';

import type { Meta, StoryObj } from '@storybook/nextjs';
import CommandPalette from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'UI/CommandPalette',
  component: CommandPalette,
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

const items = [
  {
    id: '1',
    label: 'Go to Dashboard',
    group: 'Navigation',
    icon: '🏠',
    onSelect: () => alert('Dashboard'),
  },
  {
    id: '2',
    label: 'View Shipments',
    group: 'Navigation',
    icon: '📦',
    onSelect: () => alert('Shipments'),
  },
  {
    id: '3',
    label: 'Settings',
    group: 'Navigation',
    icon: '⚙️',
    onSelect: () => alert('Settings'),
  },
  {
    id: '4',
    label: 'Create Shipment',
    group: 'Actions',
    icon: '➕',
    onSelect: () => alert('Create'),
  },
  { id: '5', label: 'Export CSV', group: 'Actions', icon: '📤', onSelect: () => alert('Export') },
  {
    id: '6',
    label: 'Bulk Update Status',
    group: 'Actions',
    icon: '✏️',
    onSelect: () => alert('Bulk'),
  },
];

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <p className="text-[var(--color-text-secondary)] text-sm mb-4">
        Press <kbd className="px-2 py-1 bg-[var(--color-bg-secondary)] rounded text-xs">⌘K</kbd> to
        open the command palette
      </p>
      <CommandPalette items={items} />
    </div>
  ),
};
