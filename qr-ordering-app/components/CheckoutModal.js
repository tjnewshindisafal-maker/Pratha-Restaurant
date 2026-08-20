import { useState } from 'react';

export default function CheckoutModal({ cart, total, onClose, onAdd, onRemove, onOrderPlaced }) {
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ name: '', phone: '', address: '', landmark: '' });
  const [paymentMode, setPaymentMode] = useState('cod');
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | locating | done | denied
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cartLines = Object.values(cart);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('done');
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(form.phone)) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    if (!form.address.trim()) {
      setError('Delivery address is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          deliveryAddress: form.address,
          landmark: form.landmark,
          customerLat: location?.lat ?? null,
          customerLng: location?.lng ?? null,
          items: cartLines.map((l) => ({ itemId: l.item.id, qty: l.qty })),
          paymentMode,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not place order');
        setSubmitting(false);
        return;
      }

      if (paymentMode === 'online' && data.razorpay) {
        openRazorpay(data.razorpay, data.order);
      } else {
        if (data.warning) setError(data.warning);
        onOrderPlaced(data.order);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function openRazorpay(razorpay, order) {
    const options = {
      key: razorpay.keyId,
      amount: razorpay.amount,
      currency: razorpay.currency,
      name: 'Pratha Restaurant',
      description: `Order #${order.id.slice(-6).toUpperCase()}`,
      order_id: razorpay.orderId,
      handler: function () {
        onOrderPlaced(order);
      },
      prefill: { name: form.name, contact: form.phone },
      theme: { color: '#6e1423' },
      modal: { ondismiss: () => setSubmitting(false) },
    };

    if (typeof window.Razorpay === 'undefined') {
      setError('Payment SDK failed to load. Please try Cash on Delivery.');
      return;
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-cream w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-cream z-10">
          <h2 className="text-lg font-serif font-bold text-maroon-dark">
            {step === 'cart' ? 'Your Cart' : 'Checkout'}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none text-gray-500">
            &times;
          </button>
        </div>

        {step === 'cart' && (
          <div className="p-5 space-y-4">
            {cartLines.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cartLines.map(({ item, qty }) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3 bg-maroon rounded-full px-3 py-1">
                    <button onClick={() => onRemove(item)} className="text-white font-bold text-lg leading-none">
                      −
                    </button>
                    <span className="text-white font-semibold w-4 text-center">{qty}</span>
                    <button onClick={() => onAdd(item)} className="text-white font-bold text-lg leading-none">
                      +
                    </button>
                  </div>
                </div>
              ))
            )}

            {cartLines.length > 0 && (
              <>
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <button onClick={() => setStep('form')} className="btn-primary w-full">
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={placeOrder} className="p-5 space-y-4">
            <div>
              <label className="text-sm font-semibold text-maroon-dark">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-maroon-dark">Phone Number</label>
              <input
                required
                inputMode="numeric"
                maxLength={10}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-maroon-dark">Delivery Address</label>
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                rows={2}
                placeholder="House no, street, area"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-maroon-dark">Landmark (optional)</label>
              <input
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={requestLocation}
                className="text-sm font-semibold text-maroon underline"
              >
                {locationStatus === 'done'
                  ? '📍 Location captured'
                  : locationStatus === 'locating'
                  ? 'Getting your location…'
                  : '📍 Share my location (helps confirm delivery is possible)'}
              </button>
              {locationStatus === 'denied' && (
                <p className="text-xs text-gray-500 mt-1">
                  Location not available — we'll confirm delivery distance by phone if needed.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-maroon-dark block mb-2">Payment Method</label>
              <div className="flex gap-3">
                <label className={`flex-1 border rounded-lg px-3 py-2 text-center cursor-pointer ${paymentMode === 'cod' ? 'border-maroon bg-maroon/5' : ''}`}>
                  <input type="radio" name="pm" className="hidden" checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} />
                  Cash on Delivery
                </label>
                <label className={`flex-1 border rounded-lg px-3 py-2 text-center cursor-pointer ${paymentMode === 'online' ? 'border-maroon bg-maroon/5' : ''}`}>
                  <input type="radio" name="pm" className="hidden" checked={paymentMode === 'online'} onChange={() => setPaymentMode('online')} />
                  Pay Online
                </label>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Placing order…' : `Place Order · ₹${total}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
