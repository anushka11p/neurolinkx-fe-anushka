import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export function useShipments(page = 1, status = '', search = '') {
  return useQuery({
    queryKey: ['shipments', page, status, search],
    queryFn: async () => {
      const res = await api.get('/api/shipments', {
        params: { page, limit: 10, status: status || undefined, search: search || undefined },
      });
      return res.data;
    },
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(`/api/shipments/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
}
