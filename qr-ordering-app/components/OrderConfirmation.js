export default function OrderConfirmation({ order, onClose }) {
  const shortId = order.id.slice(-6).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-cream rounded-2xl max-w-md w-full p-6 text-center animate-pop">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center text-4xl animate-pop">
          ✅
        </div>
        <h2 className="text-xl font-serif font-bold text-maroon-dark">Order Placed!</h2>
        <p className="text-gray-500 mt-1">Order #{shortId}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm bg-green-50 text-green-700 font-semibold px-4 py-2 rounded-full">
          ⏱ Estimated delivery: 35–45 minutes
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
