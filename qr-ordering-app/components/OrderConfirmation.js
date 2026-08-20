export default function OrderConfirmation({ order, onClose }) {
  const shortId = order.id.slice(-6).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl max-w-md w-full p-6 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-xl font-serif font-bold text-maroon-dark">Order Placed!</h2>
        <p className="text-gray-500 mt-1">Order #{shortId}</p>
        <p className="mt-4 text-sm text-gray-600">
          Estimated delivery time: <strong>35–45 minutes</strong>
        </p>

        <div className="text-left bg-white rounded-xl p-4 mt-5 space-y-1">
          {order.items.map((i) => (
            <div key={i.item_id} className="flex justify-between text-sm">
              <span>{i.qty} x {i.name}</span>
              <span>₹{i.qty * i.price}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t mt-2 pt-2">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <a href={`/track/${order.id}`} className="btn-primary">
            Track Your Order
          </a>
          <button onClick={onClose} className="btn-outline">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
