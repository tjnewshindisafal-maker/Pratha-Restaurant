import { useEffect, useRef, useState } from 'react';

const FOOD_ICONS = {
  Starters: '🍢',
  'Main Course': '🍛',
  Breads: '🫓',
  Rice: '🍚',
  Desserts: '🍮',
  Beverages: '🥤',
};

export default function MenuSection({ menuItems, cart, onAdd, onRemove, search }) {
  const categories = [...new Set(menuItems.map((m) => m.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const sectionRefs = useRef({});
  const isClickScroll = useRef(false);

  const filtered = search
    ? menuItems.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.description?.toLowerCase().includes(search.toLowerCase())
      )
    : menuItems;

  const visibleCategories = categories.filter((c) => filtered.some((m) => m.category === c));

  useEffect(() => {
    if (search) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScroll.current) return;
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveCategory(visible.target.dataset.category);
      },
      { rootMargin: '-140px 0px -70% 0px' }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [search, menuItems]);

  function scrollToCategory(category) {
    setActiveCategory(category);
    isClickScroll.current = true;
    sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => (isClickScroll.current = false), 600);
  }

  return (
    <div>
      {!search && (
        <div className="sticky top-[64px] z-20 bg-cream/95 backdrop-blur -mx-5 px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-black/5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => scrollToCategory(c)}
              className={`chip ${activeCategory === c ? 'chip-active' : 'chip-inactive'}`}
            >
              {FOOD_ICONS[c] || '🍽️'} {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-16">No dishes match "{search}"</p>
      )}

      <div className="space-y-9 pt-5">
        {visibleCategories.map((category) => (
          <div
            key={category}
            data-category={category}
            ref={(el) => (sectionRefs.current[category] = el)}
          >
            <h2 className="text-lg font-serif font-bold text-maroon-dark mb-4 flex items-center gap-2">
              <span>{FOOD_ICONS[category] || '🍽️'}</span> {category}
              <span className="text-xs font-sans font-medium text-gray-400">
                ({filtered.filter((m) => m.category === category).length})
              </span>
            </h2>
            <div className="space-y-4">
              {filtered
                .filter((m) => m.category === category)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} qty={cart[item.id]?.qty || 0} onAdd={onAdd} onRemove={onRemove} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuItemCard({ item, qty, onAdd, onRemove }) {
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    onAdd(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 300);
  }

  return (
    <div className="card card-hover flex gap-4 animate-slideUp">
      <div className="flex-1 min-w-0">
        <VegDot isVeg={item.isVeg} />
        <h3 className="font-semibold text-maroon-dark mt-1 leading-snug">{item.name}</h3>
        <p className="font-serif font-bold text-maroon mt-1">₹{item.price}</p>
        {item.description && (
          <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{item.description}</p>
        )}
      </div>

      <div className="flex flex-col items-center shrink-0">
        <div className="food-thumb">
          <span className={justAdded ? 'animate-pop' : ''}>{item.isVeg ? '🥗' : '🍗'}</span>
        </div>
        <div className="-mt-4 z-10">
          {!item.isAvailable ? (
            <span className="block text-center text-[11px] font-bold text-red-500 bg-white border border-red-200 rounded-lg px-3 py-1.5 shadow-sm">
              Sold out
            </span>
          ) : qty === 0 ? (
            <button onClick={handleAdd} className="add-btn">
              Add
            </button>
          ) : (
            <div className={`stepper ${justAdded ? 'animate-bump' : ''}`}>
              <button onClick={() => onRemove(item)}>−</button>
              <span className="font-bold text-sm w-4 text-center">{qty}</span>
              <button onClick={handleAdd}>+</button>
            </div>
          )}
        </div>
      </div>
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
