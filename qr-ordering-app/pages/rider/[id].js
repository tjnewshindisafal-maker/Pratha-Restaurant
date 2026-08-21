import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function RiderLocationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [authChecked, setAuthChecked] = useState(false);
  const [order, setOrder] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [lastSent, setLastSent] = useState(null);
  const [error, setError] = useState('');
  const watchIdRef = useRef(null);
  const latestPosRef = useRef(null);

  useEffect(() => {
    async function init() {
      const me = await fetch('/api/auth/me');
      if (!me.ok) {
        router.replace('/admin/login');
        return;
      }
      setAuthChecked(true);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (!authChecked || !id) return;
    async function loadOrder() {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) setOrder(await res.json());
    }
    loadOrder();
  }, [authChecked, id]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  function startSharing() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device.');
      return;
    }
    setError('');
    setSharing(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        latestPosRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      },
      () => setError('Could not access location. Please allow location permission.'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    sendLoop();
  }

  function sendLoop() {
    const interval = setInterval(async () => {
      if (!latestPosRef.current) return;
      const { lat, lng } = latestPosRef.current;
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderLat: lat, riderLng: lng }),
      });
      setLastSent(new Date());
    }, 5000);
    watchIdRef.current = { intervalId: interval, geoWatchId: watchIdRef.current };
  }

  function stopSharing() {
    if (watchIdRef.current?.geoWatchId != null) navigator.geolocation.clearWatch(watchIdRef.current.geoWatchId);
    if (watchIdRef.current?.intervalId) clearInterval(watchIdRef.current.intervalId);
    watchIdRef.current = null;
    setSharing(false);
  }

  if (!authChecked) return null;

  return (
    <>
      <Head>
        <title>Share Delivery Location — Pratha Restaurant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-maroon-dark px-4">
        <div className="bg-cream rounded-2xl p-6 w-full max-w-sm text-center">
          <h1 className="text-lg font-serif font-bold text-maroon-dark mb-1">Delivery Tracking</h1>
          {order && (
            <p className="text-sm text-gray-500 mb-4">
              Order #{order.id.slice(-6).toUpperCase()} · {order.customerName}
            </p>
          )}

          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${sharing ? 'bg-green-100' : 'bg-gray-100'}`}>
            {sharing ? '📍' : '🛵'}
          </div>

          {!sharing ? (
            <button onClick={startSharing} className="btn-primary w-full">
              Start Sharing My Location
            </button>
          ) : (
            <>
              <p className="text-sm text-green-700 font-semibold mb-3">Sharing location live…</p>
              {lastSent && (
                <p className="text-xs text-gray-500 mb-3">Last update: {lastSent.toLocaleTimeString()}</p>
              )}
              <button onClick={stopSharing} className="btn-outline w-full">
                Stop Sharing
              </button>
            </>
          )}

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <p className="text-xs text-gray-400 mt-5">
            Keep this page open while delivering — the customer can see your live location on their order tracking page.
          </p>
        </div>
      </div>
    </>
  );
}
