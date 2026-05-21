'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import Modal from './Modal';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
}

export default function CommandPalette({ items }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const groups = Array.from(new Set(items.map((i) => i.group ?? 'Actions')));

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} title="" size="md">
      <Command className="flex flex-col gap-2" label="Command palette">
        <Command.Input
          placeholder="Search actions..."
          className={[
            'w-full px-3 py-2 rounded-[var(--radius-md)]',
            'border border-[var(--color-border)] bg-[var(--color-bg)]',
            'text-[var(--color-text-primary)] text-[var(--font-size-sm)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
          ].join(' ')}
        />
        <Command.List className="max-h-64 overflow-y-auto flex flex-col gap-1 mt-2">
          <Command.Empty className="text-center py-4 text-[var(--color-text-muted)] text-[var(--font-size-sm)]">
            No results found.
          </Command.Empty>
          {groups.map((group) => (
            <Command.Group
              key={group}
              heading={group}
              className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-[var(--color-text-muted)] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1"
            >
              {items
                .filter((i) => (i.group ?? 'Actions') === group)
                .map((item) => (
                  <Command.Item
                    key={item.id}
                    onSelect={() => {
                      item.onSelect();
                      setOpen(false);
                    }}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]',
                      'text-[var(--font-size-sm)] text-[var(--color-text-primary)]',
                      'cursor-pointer transition-colors',
                      'aria-selected:bg-[var(--color-bg-secondary)]',
                      'hover:bg-[var(--color-bg-secondary)]',
                    ].join(' ')}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </Modal>
  );
}
