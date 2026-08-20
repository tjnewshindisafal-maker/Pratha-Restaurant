import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import MenuSection from '../components/MenuSection';
import CartBar from '../components/CartBar';
import CheckoutModal from '../components/CheckoutModal';
import OrderConfirmation from '../components/OrderConfirmation';

export default function HomePage() {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const [rRes, mRes] = await Promise.all([fetch('/api/restaurant'), fetch('/api/menu')]);
      if (rRes.ok) setRestaurant(await rRes.json());
      if (mRes.ok) setMenuItems(await mRes.json());
      setLoading(false);
    }
    load();
  }, []);

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev[item.id];
      return { ...prev, [item.id]: { item, qty: (existing?.qty || 0) + 1 } };
    });
  }

  function removeFromCart(item) {
    setCart((prev) => {
      const existing = prev[item.id];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: { item, qty: existing.qty - 1 } };
    });
  }

  const itemCount = Object.values(cart).reduce((sum, l) => sum + l.qty, 0);
  const total = Object.values(cart).reduce((sum, l) => sum + l.qty * l.item.price, 0);

  function handleOrderPlaced(order) {
    setShowCheckout(false);
    setCart({});
    setConfirmedOrder(order);
  }

  return (
    <>
      <Head>
        <title>Pratha Restaurant — Order Online</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <header className="bg-maroon text-white sticky top-0 z-30 shadow-md h-16 flex items-center">
        <div className="max-w-2xl mx-auto px-5 w-full flex items-center justify-between">
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight">{restaurant?.name || 'Pratha Restaurant'}</h1>
            <p className="text-[11px] text-gold-light">Authentic Flavors, Timeless Tradition</p>
          </div>
          {restaurant && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                restaurant.isOpen ? 'bg-green-600' : 'bg-gray-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-white ${restaurant.isOpen ? 'animate-pulse' : ''}`} />
              {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pb-28">
        {loading && (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-maroon/30 border-t-maroon rounded-full animate-spin" />
            <span className="text-sm">Loading menu…</span>
          </div>
        )}

        {!loading && (
          <>
            <div className="mt-4 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(74,13,24,0.12)]">
              <div
                className="h-28 relative flex items-end p-4"
                style={{
                  background:
                    'linear-gradient(135deg, #6e1423 0%, #8a1c2e 40%, #c9a24b 100%)',
                }}
              >
                <span className="absolute top-3 right-3 text-4xl opacity-90">🍛</span>
                <div className="text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold bg-black/25 backdrop-blur px-2.5 py-1 rounded-full w-fit">
                    <span className="text-gold-light">★ 4.6</span>
                    <span className="opacity-60">|</span>
                    <span>2.1k+ orders</span>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-maroon-dark">⏱ 35–45 min delivery</p>
                  <p className="text-xs text-gray-400 mt-0.5">Free delivery within {restaurant?.deliveryRadiusKm || 6} km</p>
                </div>
                <span className="badge">No packaging fee</span>
              </div>
            </div>

            {restaurant && !restaurant.isOpen && (
              <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4 mt-4 text-center font-medium">
                We're currently closed. Please check back during our opening hours.
              </div>
            )}

            <div className="relative mt-5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for dishes..."
                className="w-full bg-white border border-black/10 rounded-xl pl-10 pr-4 py-3 text-sm shadow-sm outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition"
              />
            </div>
          </>
        )}

        {!loading && menuItems.length > 0 && (
          <div className="mt-2">
            <MenuSection menuItems={menuItems} cart={cart} onAdd={addToCart} onRemove={removeFromCart} search={search} />
          </div>
        )}

        {!loading && menuItems.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Menu is being updated. Please check back shortly, or run the seed script (see README).
          </p>
        )}
      </main>

      <CartBar itemCount={itemCount} total={total} onClick={() => setShowCheckout(true)} />

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={total}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClose={() => setShowCheckout(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {confirmedOrder && (
        <OrderConfirmation order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />
      )}
    </>
  );
}
