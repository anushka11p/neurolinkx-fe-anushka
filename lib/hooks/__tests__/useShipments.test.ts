import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useShipments } from '../useShipments';
import { api } from '@/lib/api/axios';

vi.mock('@/lib/api/axios', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useShipments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [], total: 0, page: 1, totalPages: 0 } });
    const { result } = renderHook(() => useShipments(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns data on success', async () => {
    const mockData = {
      data: [{ id: 'SHP-1001', status: 'delivered' }],
      total: 1,
      page: 1,
      totalPages: 1,
    };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });
    const { result } = renderHook(() => useShipments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('returns error state on failure', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useShipments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
