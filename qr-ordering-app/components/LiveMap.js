import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

// Free OpenStreetMap tiles via Leaflet — no API key needed.
export default function LiveMap({ restaurantPos, customerPos, riderPos, height = 260 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) setLeafletReady(true);
  }, []);

  useEffect(() => {
    if (!leafletReady || !containerRef.current || mapRef.current) return;
    const L = window.L;

    const center = riderPos || customerPos || restaurantPos || { lat: 20.5937, lng: 78.9629 };
    const map = L.map(containerRef.current).setView([center.lat, center.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
  }, [leafletReady, restaurantPos, customerPos, riderPos]);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;

    function upsertMarker(key, pos, options) {
      if (!pos) return;
      if (markersRef.current[key]) {
        markersRef.current[key].setLatLng([pos.lat, pos.lng]);
      } else {
        markersRef.current[key] = L.marker([pos.lat, pos.lng], options).addTo(map);
      }
    }

    const restaurantIcon = L.divIcon({
      html: '<div style="font-size:22px">🏠</div>',
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    const customerIcon = L.divIcon({
      html: '<div style="font-size:22px">📍</div>',
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
    const riderIcon = L.divIcon({
      html: '<div style="font-size:24px">🛵</div>',
      className: '',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    upsertMarker('restaurant', restaurantPos, { icon: restaurantIcon, title: 'Restaurant' });
    upsertMarker('customer', customerPos, { icon: customerIcon, title: 'Delivery address' });
    upsertMarker('rider', riderPos, { icon: riderIcon, title: 'Delivery partner' });

    if (riderPos) {
      map.panTo([riderPos.lat, riderPos.lng]);
    }
  }, [restaurantPos, customerPos, riderPos]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </Head>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        strategy="afterInteractive"
        onLoad={() => setLeafletReady(true)}
      />
      <div ref={containerRef} style={{ height, width: '100%', borderRadius: 12, overflow: 'hidden' }} />
    </>
  );
}
