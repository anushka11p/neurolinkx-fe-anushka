'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

interface Stats {
  totalShipments: number;
  onTimePercent: number;
  delayed: number;
  revenue: number;
  chartData: { date: string; shipments: number; revenue: number }[];
}

function KPICard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
      <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded animate-pulse mb-4" />
      <div className="h-8 w-16 bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
    </div>
  );
}

export default function DashboardPage() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/api/stats');
      return res.data;
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* KPI Cards */}
      {isError ? (
        <div className="p-4 bg-[#FEF2F2] border border-[var(--color-danger)] rounded-[var(--radius-md)]">
          <p className="text-sm text-[var(--color-danger)]">
            Failed to load stats. Please refresh.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <KPICard
                title="Total Shipments"
                value={stats!.totalShipments}
                icon="📦"
                color="text-[var(--color-text-primary)]"
              />
              <KPICard
                title="On-Time %"
                value={`${stats!.onTimePercent}%`}
                icon="✅"
                color="text-[var(--color-success)]"
              />
              <KPICard
                title="Delayed"
                value={stats!.delayed}
                icon="⚠️"
                color="text-[var(--color-danger)]"
              />
              <KPICard
                title="Revenue"
                value={`$${stats!.revenue.toLocaleString()}`}
                icon="💰"
                color="text-[var(--color-primary)]"
              />
            </>
          )}
        </div>
      )}

      {/* Charts */}
      {!isLoading && !isError && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Simple bar chart using divs */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-4">
              Shipments per Day
            </h3>
            <div className="flex items-end gap-2 h-32">
              {stats.chartData.map((d) => {
                const max = Math.max(...stats.chartData.map((x) => x.shipments));
                const height = Math.round((d.shipments / max) * 100);
                return (
                  <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-full bg-[var(--color-primary)] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${height}%` }}
                      title={`${d.shipments} shipments`}
                    />
                    <span className="text-[10px] text-[var(--color-text-muted)] rotate-45 origin-left">
                      {d.date.replace('May ', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue chart */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-4">
              Revenue per Day
            </h3>
            <div className="flex items-end gap-2 h-32">
              {stats.chartData.map((d) => {
                const max = Math.max(...stats.chartData.map((x) => x.revenue));
                const height = Math.round((d.revenue / max) * 100);
                return (
                  <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-full bg-[var(--color-secondary)] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${height}%` }}
                      title={`$${d.revenue.toLocaleString()}`}
                    />
                    <span className="text-[10px] text-[var(--color-text-muted)] rotate-45 origin-left">
                      {d.date.replace('May ', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
