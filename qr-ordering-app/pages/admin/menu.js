import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', isVeg: true };

export default function AdminMenu() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      const me = await fetch('/api/auth/me');
      if (!me.ok) {
        router.replace('/admin/login');
        return;
      }
      setAuthChecked(true);
      await loadItems();
    }
    init();
  }, [router]);

  async function loadItems() {
    const res = await fetch('/api/menu');
    if (res.ok) setItems(await res.json());
  }

  async function addItem(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not add item');
      return;
    }
    setForm(EMPTY_FORM);
    loadItems();
  }

  async function toggleAvailable(item) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i)));
    await fetch(`/api/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
  }

  async function deleteItem(item) {
    if (!confirm(`Remove "${item.name}" from the menu?`)) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await fetch(`/api/menu/${item.id}`, { method: 'DELETE' });
  }

  if (!authChecked) return null;

  return (
    <>
      <Head>
        <title>Menu Management — Pratha Restaurant</title>
      </Head>
      <div className="min-h-screen">
        <header className="bg-maroon text-white sticky top-0 z-30">
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
            <h1 className="font-serif font-bold">Menu Management</h1>
            <a href="/admin/dashboard" className="text-sm underline">&larr; Back to Dashboard</a>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-5 py-6">
          <form onSubmit={addItem} className="card mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <h2 className="sm:col-span-2 font-semibold text-maroon-dark">Add Menu Item</h2>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              required
              placeholder="Category (e.g. Starters)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              required
              type="number"
              min="0"
              step="1"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={form.isVeg ? 'veg' : 'nonveg'}
              onChange={(e) => setForm({ ...form, isVeg: e.target.value === 'veg' })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="veg">Veg</option>
              <option value="nonveg">Non-Veg</option>
            </select>
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded-lg px-3 py-2 sm:col-span-2"
              rows={2}
            />
            {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
            <button type="submit" className="btn-primary sm:col-span-2">Add Item</button>
          </form>

          <h2 className="font-semibold text-maroon-dark mb-3">Current Menu ({items.length})</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {item.name} <span className="text-xs text-gray-400">· {item.category}</span>
                  </p>
                  <p className="text-sm text-maroon font-serif font-bold">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={item.isAvailable} onChange={() => toggleAvailable(item)} />
                    Available
                  </label>
                  <button onClick={() => deleteItem(item)} className="text-red-500 text-sm font-semibold">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
