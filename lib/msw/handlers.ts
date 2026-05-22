import { http, HttpResponse } from 'msw';

const shipments = Array.from({ length: 50 }, (_, i) => ({
  id: `SHP-${1000 + i}`,
  origin: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][i % 4],
  destination: ['New York', 'London', 'Dubai', 'Singapore'][i % 4],
  status: ['delivered', 'pending', 'delayed', 'transit'][i % 4],
  date: `2025-05-${String((i % 28) + 1).padStart(2, '0')}`,
  revenue: Math.floor(Math.random() * 10000) + 1000,
  carrier: ['FedEx', 'DHL', 'UPS', 'BlueDart'][i % 4],
  weight: `${(Math.random() * 100).toFixed(1)} kg`,
  eta: `2025-06-${String((i % 28) + 1).padStart(2, '0')}`,
  events: [
    { status: 'Order Placed', timestamp: '2025-05-01T10:00:00Z', location: 'Mumbai' },
    { status: 'Picked Up', timestamp: '2025-05-02T14:00:00Z', location: 'Mumbai' },
    { status: 'In Transit', timestamp: '2025-05-03T09:00:00Z', location: 'Dubai' },
  ],
}));

const notifications = Array.from({ length: 10 }, (_, i) => ({
  id: `notif-${i}`,
  message: `Shipment SHP-${1000 + i} status updated to ${['delivered', 'delayed', 'transit'][i % 3]}`,
  read: i > 4,
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

export const handlers = [
  // Get all shipments with pagination
  http.get('/api/shipments', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let filtered = [...shipments];
    if (status) filtered = filtered.filter((s) => s.status === status);
    if (search)
      filtered = filtered.filter(
        (s) =>
          s.id.toLowerCase().includes(search.toLowerCase()) ||
          s.origin.toLowerCase().includes(search.toLowerCase()) ||
          s.destination.toLowerCase().includes(search.toLowerCase())
      );

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  // Get single shipment
  http.get('/api/shipments/:id', ({ params }) => {
    const shipment = shipments.find((s) => s.id === params.id);
    if (!shipment) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(shipment);
  }),

  // Update shipment status
  http.patch('/api/shipments/:id', async ({ params, request }) => {
    const body = (await request.json()) as { status?: string };
    const shipment = shipments.find((s) => s.id === params.id);
    if (!shipment) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    if (body.status) shipment.status = body.status;
    return HttpResponse.json(shipment);
  }),

  // KPI stats
  http.get('/api/stats', () => {
    return HttpResponse.json({
      totalShipments: shipments.length,
      onTimePercent: 78,
      delayed: shipments.filter((s) => s.status === 'delayed').length,
      revenue: shipments.reduce((acc, s) => acc + s.revenue, 0),
      chartData: Array.from({ length: 7 }, (_, i) => ({
        date: `May ${i + 15}`,
        shipments: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 50000) + 10000,
      })),
    });
  }),

  // Notifications
  http.get('/api/notifications', () => {
    return HttpResponse.json(notifications);
  }),

  http.patch('/api/notifications/:id/read', ({ params }) => {
    const notif = notifications.find((n) => n.id === params.id);
    if (notif) notif.read = true;
    return HttpResponse.json(notif);
  }),
];
