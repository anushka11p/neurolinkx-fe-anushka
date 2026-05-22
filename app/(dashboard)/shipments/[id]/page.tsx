'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api/axios';
import Button from '@/app/components/ui/Button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select } from '@/app/components/ui/FormFields';
import { toast } from '@/app/components/ui/Toast';

interface ShipmentEvent {
  status: string;
  timestamp: string;
  location: string;
}

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  date: string;
  revenue: number;
  carrier: string;
  weight: string;
  eta: string;
  events: ShipmentEvent[];
}

const editSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  status: z.string().min(1, 'Status is required'),
  carrier: z.string().min(1, 'Carrier is required'),
});

type EditData = z.infer<typeof editSchema>;

const statusColors: Record<string, string> = {
  delivered: 'bg-[#F0FDF4] text-[var(--color-success)]',
  pending: 'bg-[#FFFBEB] text-[var(--color-warning)]',
  delayed: 'bg-[#FEF2F2] text-[var(--color-danger)]',
  transit: 'bg-[#EFF6FF] text-[var(--color-secondary)]',
};

function Timeline({ events }: { events: ShipmentEvent[] }) {
  return (
    <div className="flex flex-col gap-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          {/* Line + dot */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] mt-1 shrink-0" />
            {i < events.length - 1 && (
              <div className="w-0.5 flex-1 bg-[var(--color-border)] my-1" />
            )}
          </div>
          {/* Content */}
          <div className="pb-6">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{event.status}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {event.location} · {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  const {
    data: shipment,
    isLoading,
    isError,
  } = useQuery<Shipment>({
    queryKey: ['shipment', params.id],
    queryFn: async () => {
      const res = await api.get(`/api/shipments/${params.id as string}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditData>({
    resolver: zodResolver(editSchema),
    values: shipment
      ? {
          origin: shipment.origin,
          destination: shipment.destination,
          status: shipment.status,
          carrier: shipment.carrier,
        }
      : undefined,
  });

  const onSubmit = (data: EditData) => {
    console.log('Updated:', data);
    toast.success('Shipment updated successfully!');
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
        <div className="h-64 bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
      </div>
    );
  }

  if (isError || !shipment) {
    return (
      <div className="p-4 bg-[#FEF2F2] border border-[var(--color-danger)] rounded-[var(--radius-md)]">
        <p className="text-sm text-[var(--color-danger)]">Shipment not found or failed to load.</p>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mt-2">
          ← Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{shipment.id}</h1>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[shipment.status] ?? ''}`}
            >
              {shipment.status}
            </span>
          </div>
        </div>
        <Button
          variant={editMode ? 'ghost' : 'secondary'}
          size="sm"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Details / Edit form */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
            Shipment Details
          </h2>

          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                id="origin"
                label="Origin"
                error={errors.origin?.message}
                {...register('origin')}
              />
              <Input
                id="destination"
                label="Destination"
                error={errors.destination?.message}
                {...register('destination')}
              />
              <Select
                id="status"
                label="Status"
                options={[
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'delayed', label: 'Delayed' },
                  { value: 'transit', label: 'In Transit' },
                ]}
                error={errors.status?.message}
                {...register('status')}
              />
              <Input
                id="carrier"
                label="Carrier"
                error={errors.carrier?.message}
                {...register('carrier')}
              />
              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                { label: 'Origin', value: shipment.origin },
                { label: 'Destination', value: shipment.destination },
                { label: 'Carrier', value: shipment.carrier },
                { label: 'Weight', value: shipment.weight },
                { label: 'Revenue', value: `$${shipment.revenue.toLocaleString()}` },
                { label: 'Date', value: shipment.date },
                { label: 'ETA', value: shipment.eta },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0"
                >
                  <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
            Status Timeline
          </h2>
          <Timeline events={shipment.events} />
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Route Map</h2>
        <div className="h-48 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-2">🗺️</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {shipment.origin} → {shipment.destination}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Map embed requires Mapbox token
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
