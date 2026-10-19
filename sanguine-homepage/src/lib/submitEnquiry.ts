export type Enquiry = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  outlets: string;
  city: string;
  product: string;
  message: string;
};

export class EnquiryNotConfigured extends Error {}

declare global {
  interface Window {
    /** Injected by the WordPress plugin so the built page needs no rebuild per site. */
    SANGUINE_CONFIG?: { enquiryEndpoint?: string };
  }
}

const ENDPOINT = (
  window.SANGUINE_CONFIG?.enquiryEndpoint ?? (import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined)
)?.trim();

/**
 * POSTs the enquiry as JSON. Resolves only on a 2xx response; anything else
 * throws, so the UI never reports a success that did not happen.
 */
export async function submitEnquiry(data: Enquiry): Promise<void> {
  if (!ENDPOINT) throw new EnquiryNotConfigured("Enquiry endpoint is not configured");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, source: "landing-page", submittedAt: new Date().toISOString() }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Enquiry failed with status ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}
