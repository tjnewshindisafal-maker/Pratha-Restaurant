export default function CartBar({ itemCount, total, onClick }) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
      <button
        onClick={onClick}
        className="w-full max-w-lg mx-auto flex items-center justify-between bg-maroon text-white rounded-full shadow-xl px-6 py-4"
      >
        <span className="font-semibold">{itemCount} item{itemCount > 1 ? 's' : ''} · ₹{total}</span>
        <span className="font-semibold flex items-center gap-1">
          View Cart <span aria-hidden>→</span>
        </span>
      </button>
    </div>
  );
}
