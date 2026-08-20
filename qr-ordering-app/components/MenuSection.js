export default function MenuSection({ menuItems, cart, onAdd, onRemove }) {
  const categories = [...new Set(menuItems.map((m) => m.category))];

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-xl font-serif font-bold text-maroon-dark mb-4 uppercase tracking-wide">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems
              .filter((m) => m.category === category)
              .map((item) => {
                const qty = cart[item.id]?.qty || 0;
                return (
                  <div key={item.id} className="card flex justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <VegDot isVeg={item.isVeg} />
                        <h3 className="font-semibold text-maroon-dark">{item.name}</h3>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                      <p className="font-serif font-bold text-maroon mt-2">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                      {!item.isAvailable ? (
                        <span className="text-xs font-semibold text-red-500 border border-red-200 rounded-full px-3 py-1">
                          Sold out
                        </span>
                      ) : qty === 0 ? (
                        <button onClick={() => onAdd(item)} className="btn-outline !px-4 !py-2 text-sm">
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-maroon rounded-full px-3 py-1">
                          <button onClick={() => onRemove(item)} className="text-white font-bold text-lg leading-none">
                            −
                          </button>
                          <span className="text-white font-semibold w-4 text-center">{qty}</span>
                          <button onClick={() => onAdd(item)} className="text-white font-bold text-lg leading-none">
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function VegDot({ isVeg }) {
  return (
    <span
      className={`inline-block w-3.5 h-3.5 border-2 ${isVeg ? 'border-green-600' : 'border-red-600'} rounded-sm relative shrink-0`}
      title={isVeg ? 'Veg' : 'Non-veg'}
    >
      <span className={`absolute inset-[2px] rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
    </span>
  );
}
