export default function CartBar({ itemCount, total, onClick }) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 pointer-events-none">
      <button
        onClick={onClick}
        className="pointer-events-auto w-full max-w-lg mx-auto flex items-center justify-between bg-green-600 text-white rounded-xl shadow-2xl px-5 py-3.5 animate-sheetUp active:scale-[0.98] transition-transform"
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          <span className="bg-white/20 rounded-md w-6 h-6 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
          <span>Item{itemCount > 1 ? 's' : ''} added &middot; ₹{total}</span>
        </span>
        <span className="font-bold flex items-center gap-1 text-sm">
          View Cart <span aria-hidden>→</span>
        </span>
      </button>
    </div>
  );
}
