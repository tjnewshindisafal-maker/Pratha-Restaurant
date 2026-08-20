import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminQrCode() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    async function check() {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.replace('/admin/login');
        return;
      }
      setAuthChecked(true);
      setBaseUrl(window.location.origin);
    }
    check();
  }, [router]);

  if (!authChecked) return null;

  return (
    <>
      <Head>
        <title>QR Code — Pratha Restaurant</title>
      </Head>
      <div className="min-h-screen">
        <header className="bg-maroon text-white sticky top-0 z-30">
          <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
            <h1 className="font-serif font-bold">Ordering QR Code</h1>
            <a href="/admin/dashboard" className="text-sm underline">&larr; Back to Dashboard</a>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-5 py-10 text-center">
          <p className="text-gray-600 mb-6">
            Print this QR code on table tents, packaging, or pamphlets. Scanning it opens your live ordering page.
          </p>

          <div className="card inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/api/qrcode" alt="Ordering page QR code" width={300} height={300} />
          </div>

          <p className="text-sm text-gray-500 mt-4 break-all">{baseUrl}/</p>

          <div className="mt-6">
            <a href="/api/qrcode" download="pratha-order-qr.png" className="btn-primary">
              Download QR Code
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
