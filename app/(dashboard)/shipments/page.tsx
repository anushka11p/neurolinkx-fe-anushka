'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { type ColumnDef } from '@tanstack/react-table';
import { api } from '@/lib/api/axios';
import DataTable from '@/app/components/ui/DataTable';
import Button from '@/app/components/ui/Button';
import { toast } from '@/app/components/ui/Toast';
import { useState } from 'react';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  date: string;
  revenue: number;
  carrier: string;
}

interface ShipmentsResponse {
  data: Shipment[];
  total: number;
  page: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  delivered: 'bg-[#F0FDF4] text-[var(--color-success)]',
  pending: 'bg-[#FFFBEB] text-[var(--color-warning)]',
  delayed: 'bg-[#FEF2F2] text-[var(--color-danger)]',
  transit: 'bg-[#EFF6FF] text-[var(--color-secondary)]',
};

export default function ShipmentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useQueryState('page', { defaultValue: '1' });
  const [status, setStatus] = useQueryState('status', { defaultValue: '' });
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isError } = useQuery<ShipmentsResponse>({
    queryKey: ['shipments', page, status, search],
    queryFn: async () => {
      const res = await api.get('/api/shipments', {
        params: { page, limit: 10, status: status || undefined, search: search || undefined },
      });
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const res = await api.patch(`/api/shipments/${id}`, { status: newStatus });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Status updated successfully');
      setSelectedIds([]);
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const columns: ColumnDef<Shipment, unknown>[] = [
    {
      id: 'select',
      header: () => <input type="checkbox" aria-label="Select all" />,
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, row.original.id]);
            } else {
              setSelectedIds((prev) => prev.filter((id) => id !== row.original.id));
            }
          }}
          aria-label="Select row"
        />
      ),
    },
    { accessorKey: 'id', header: 'Shipment ID' },
    { accessorKey: 'origin', header: 'Origin' },
    { accessorKey: 'destination', header: 'Destination' },
    { accessorKey: 'carrier', header: 'Carrier' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[s] ?? ''}`}>
            {s}
          </span>
        );
      },
    },
    { accessorKey: 'date', header: 'Date' },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Shipments</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {data?.total ?? 0} total shipments
          </p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {selectedIds.length} selected
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                selectedIds.forEach((id) => updateStatus.mutate({ id, newStatus: 'delivered' }))
              }
            >
              Mark Delivered
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() =>
                selectedIds.forEach((id) => updateStatus.mutate({ id, newStatus: 'delayed' }))
              }
            >
              Mark Delayed
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search shipments..."
          value={search}
          onChange={(e) => {
            void setSearch(e.target.value);
            void setPage('1');
          }}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-48"
        />
        <select
          value={status}
          onChange={(e) => {
            void setStatus(e.target.value);
            void setPage('1');
          }}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">All statuses</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="delayed">Delayed</option>
          <option value="transit">In Transit</option>
        </select>
        {(status || search) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              void setStatus('');
              void setSearch('');
              void setPage('1');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {isError ? (
        <div className="p-4 bg-[#FEF2F2] border border-[var(--color-danger)] rounded-[var(--radius-md)]">
          <p className="text-sm text-[var(--color-danger)]">Failed to load shipments.</p>
        </div>
      ) : (
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No shipments found."
        />
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Page {page} of {data.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={page === '1'}
              onClick={() => void setPage(String(Number(page) - 1))}
            >
              ← Prev
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={Number(page) >= data.totalPages}
              onClick={() => void setPage(String(Number(page) + 1))}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
