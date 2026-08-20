import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const STEPS = [
  { key: 'new', label: 'Order Placed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function TrackOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        setError('Order not found');
        return;
      }
      setOrder(await res.json());
    }

    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [id]);

  if (error) {
    return <div className="max-w-md mx-auto p-8 text-center text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="max-w-md mx-auto p-8 text-center text-gray-500">Loading order…</div>;
  }

  const isCancelled = order.orderStatus === 'cancelled';
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <>
      <Head>
        <title>Track Order — Pratha Restaurant</title>
      </Head>
      <div className="max-w-md mx-auto p-6">
        <a href="/" className="text-sm text-maroon font-semibold">
          &larr; Back to menu
        </a>
        <h1 className="text-2xl font-serif font-bold text-maroon-dark mt-3">
          Order #{order.id.slice(-6).toUpperCase()}
        </h1>
        <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>

        {isCancelled ? (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 font-medium">
            This order was cancelled.
          </div>
        ) : (
          <ol className="mt-8 space-y-6">
            {STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              return (
                <li key={step.key} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      done ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={done ? 'font-semibold text-maroon-dark' : 'text-gray-400'}>{step.label}</span>
                </li>
              );
            })}
          </ol>
        )}

        <div className="card mt-8">
          <h2 className="font-semibold text-maroon-dark mb-3">Order Summary</h2>
          {order.items.map((i) => (
            <div key={i.item_id} className="flex justify-between text-sm mb-1">
              <span>{i.qty} x {i.name}</span>
              <span>₹{i.qty * i.price}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t mt-3 pt-3">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Payment: {order.paymentMode === 'cod' ? 'Cash on Delivery' : 'Paid Online'} · {order.paymentStatus}
          </p>
        </div>

        <div className="card mt-4">
          <h2 className="font-semibold text-maroon-dark mb-2">Delivery Address</h2>
          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
          {order.landmark && <p className="text-sm text-gray-500">Landmark: {order.landmark}</p>}
        </div>
      </div>
    </>
  );
}
