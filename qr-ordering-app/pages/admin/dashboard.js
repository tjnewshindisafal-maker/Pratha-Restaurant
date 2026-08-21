import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const STATUS_OPTIONS = ['new', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_LABELS = {
  new: 'New',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
const POLL_MS = 6000;

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const knownOrderIds = useRef(new Set());

  function playAlertBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio alerts are best-effort — ignore if the browser blocks autoplay.
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.replace('/admin/login');
        return;
      }
      setAuthChecked(true);
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    async function poll() {
      const [ordersRes, statsRes, restaurantRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/analytics'),
        fetch('/api/restaurant'),
      ]);

      if (ordersRes.status === 401) {
        router.replace('/admin/login');
        return;
      }

      const freshOrders = await ordersRes.json();
      const hasNew = freshOrders.some((o) => !knownOrderIds.current.has(o.id));
      if (hasNew && knownOrderIds.current.size > 0) {
        playAlertBeep();
      }
      knownOrderIds.current = new Set(freshOrders.map((o) => o.id));

      setOrders(freshOrders);
      if (statsRes.ok) setStats(await statsRes.json());
      if (restaurantRes.ok) setRestaurant(await restaurantRes.json());
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [authChecked, router]);

  async function updateStatus(orderId, orderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus } : o)));
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus }),
    });
  }

  async function toggleOpen() {
    const res = await fetch('/api/restaurant', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen: !restaurant.isOpen }),
    });
    if (res.ok) setRestaurant(await res.json());
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  function notifyRider(order) {
    const trackingLink = `${window.location.origin}/rider/${order.id}`;
    const text = `Delivery for order #${order.id.slice(-6).toUpperCase()}: ${order.customerName}, ${order.deliveryAddress}${
      order.landmark ? ` (near ${order.landmark})` : ''
    }. Phone: ${order.customerPhone}.\n\nOpen this link on your phone and tap "Start Sharing" so the customer can see your live location: ${trackingLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  if (!authChecked) return null;

  return (
    <>
      <Head>
        <title>Dashboard — Pratha Restaurant</title>
      </Head>
      <div className="min-h-screen">
        <header className="bg-maroon text-white sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <h1 className="font-serif font-bold">Pratha — Staff Dashboard</h1>
            <div className="flex items-center gap-4">
              <a href="/admin/menu" className="text-sm underline">Menu</a>
              <a href="/admin/qrcode" className="text-sm underline">QR Code</a>
              {restaurant && (
                <button
                  onClick={toggleOpen}
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${restaurant.isOpen ? 'bg-green-600' : 'bg-gray-500'}`}
                >
                  {restaurant.isOpen ? 'Open' : 'Closed'} · Toggle
                </button>
              )}
              <button onClick={logout} className="text-sm underline">Logout</button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-5 py-6">
          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard label="Today's Orders" value={stats.totalOrders} />
              <StatCard label="Today's Revenue" value={`₹${stats.totalRevenue}`} />
              <StatCard label="Avg Order Value" value={`₹${stats.avgOrderValue}`} />
            </div>
          )}

          <h2 className="font-serif font-bold text-lg text-maroon-dark mb-4">Live Orders</h2>

          {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-maroon-dark">
                      #{order.id.slice(-6).toUpperCase()} · {order.customerName} · {order.customerPhone}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-maroon">₹{order.totalAmount}</p>
                    <p className="text-xs text-gray-500">
                      {order.paymentMode === 'cod' ? 'COD' : 'Online'} ·{' '}
                      <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}>
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">{order.deliveryAddress}</p>

                <ul className="text-sm text-gray-700 mb-3 list-disc list-inside">
                  {order.items.map((i) => (
                    <li key={i.item_id}>{i.qty} x {i.name}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <button onClick={() => notifyRider(order)} className="text-sm text-green-700 font-semibold underline">
                    Notify Rider (WhatsApp)
                  </button>
                  <a
                    href={`/rider/${order.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-maroon font-semibold underline"
                  >
                    Open Rider Tracking Page
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card text-center">
      <p className="text-2xl font-serif font-bold text-maroon-dark">{value}</p>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}
