import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Login failed');
      setSubmitting(false);
      return;
    }

    router.push('/admin/dashboard');
  }

  return (
    <>
      <Head>
        <title>Staff Login — Pratha Restaurant</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-maroon-dark px-4">
        <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-serif font-bold text-maroon-dark mb-1">Pratha Restaurant</h1>
          <p className="text-sm text-gray-500 mb-6">Staff &amp; Owner Login</p>

          <label className="text-sm font-semibold text-maroon-dark">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 mb-4 border rounded-lg px-3 py-2"
          />

          <label className="text-sm font-semibold text-maroon-dark">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 mb-4 border rounded-lg px-3 py-2"
          />

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            First time? Run <code>npm run seed</code> — default login is owner@pratharestaurant.com / pratha123.
          </p>
        </form>
      </div>
    </>
  );
}
