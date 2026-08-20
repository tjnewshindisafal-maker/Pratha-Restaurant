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

      <header className="bg-maroon text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif font-bold text-lg">{restaurant?.name || 'Pratha Restaurant'}</h1>
            <p className="text-xs text-gold-light">Authentic Flavors, Timeless Tradition</p>
          </div>
          {restaurant && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                restaurant.isOpen ? 'bg-green-600' : 'bg-gray-500'
              }`}
            >
              {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 pb-28">
        {loading && <p className="text-center text-gray-500 py-10">Loading menu…</p>}

        {!loading && restaurant && !restaurant.isOpen && (
          <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-center font-medium">
            We're currently closed. Please check back during our opening hours.
          </div>
        )}

        {!loading && menuItems.length > 0 && (
          <MenuSection menuItems={menuItems} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
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
