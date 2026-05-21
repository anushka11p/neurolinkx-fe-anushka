import type { Meta, StoryObj } from '@storybook/nextjs';
import { type ColumnDef } from '@tanstack/react-table';
import DataTable from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
};
export default meta;
type Story = StoryObj<typeof DataTable>;

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  date: string;
}

const columns: ColumnDef<Shipment, unknown>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="accent-[var(--color-primary)]"
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="accent-[var(--color-primary)]"
        aria-label="Select row"
      />
    ),
  },
  { accessorKey: 'id', header: 'Shipment ID' },
  { accessorKey: 'origin', header: 'Origin' },
  { accessorKey: 'destination', header: 'Destination' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const colors: Record<string, string> = {
        delivered: 'bg-[#F0FDF4] text-[var(--color-success)]',
        pending: 'bg-[#FFFBEB] text-[var(--color-warning)]',
        delayed: 'bg-[#FEF2F2] text-[var(--color-danger)]',
        transit: 'bg-[#EFF6FF] text-[var(--color-secondary)]',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] ?? ''}`}>
          {status}
        </span>
      );
    },
  },
  { accessorKey: 'date', header: 'Date' },
];

const mockData: Shipment[] = Array.from({ length: 25 }, (_, i) => ({
  id: `SHP-${1000 + i}`,
  origin: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][i % 4],
  destination: ['New York', 'London', 'Dubai', 'Singapore'][i % 4],
  status: ['delivered', 'pending', 'delayed', 'transit'][i % 4],
  date: `2025-05-${String(i + 1).padStart(2, '0')}`,
}));

export const Default: Story = {
  render: () => <DataTable data={mockData} columns={columns} />,
};

export const Loading: Story = {
  render: () => <DataTable data={[]} columns={columns} isLoading={true} />,
};

export const Empty: Story = {
  render: () => <DataTable data={[]} columns={columns} emptyMessage="No shipments found." />,
};
