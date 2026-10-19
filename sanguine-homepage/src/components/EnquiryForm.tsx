import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { contact, industryOptions, outletOptions, productOptions } from "../data/site";
import { EnquiryNotConfigured, submitEnquiry, type Enquiry } from "../lib/submitEnquiry";
import { Reveal } from "./ui/Reveal";

type Errors = Partial<Record<keyof Enquiry, string>>;
type Status = "idle" | "loading" | "success" | "error";

const EMPTY: Enquiry = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  outlets: "",
  city: "",
  product: "",
  message: "",
};

// Submissions faster than this after the form appears are treated as bots.
const MIN_FILL_MS = 3000;

function validate(v: Enquiry): Errors {
  const e: Errors = {};
  if (v.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid work email.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) e.phone = "Please enter a valid phone number.";
  if (!v.company.trim()) e.company = "Please enter your company or brand name.";
  if (!v.industry) e.industry = "Please select your business type.";
  if (!v.outlets) e.outlets = "Please select the number of outlets.";
  if (!v.city.trim()) e.city = "Please enter your city.";
  if (!v.product) e.product = "Please choose a product of interest.";
  if (v.message.length > 1000) e.message = "Please keep your message under 1,000 characters.";
  return e;
}

const inputBase =
  "mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-slate-400 transition focus:outline-none focus:ring-4";

function Field({
  id,
  label,
  error,
  optional,
  children,
  full,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label} {optional && <span className="font-normal text-slate-400">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-600">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}

export default function EnquiryForm() {
  const [values, setValues] = useState<Enquiry>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Enquiry, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<ReactNode>(null);
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof Enquiry) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors((prev) => ({ ...prev, [k]: validate(next)[k] }));
  };
  const blur = (k: keyof Enquiry) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((prev) => ({ ...prev, [k]: validate(values)[k] }));
  };

  const props = (k: keyof Enquiry) => ({
    id: k,
    name: k,
    value: values[k],
    onChange: set(k),
    onBlur: blur(k),
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
    className: `${inputBase} ${
      errors[k] ? "border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-accent-blue focus:ring-accent-blue/15"
    }`,
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }

    const fallback = (
      <>
        Please call sales on{" "}
        <a className="font-semibold underline" href={`tel:${contact.sales.tel}`}>
          {contact.sales.phone}
        </a>{" "}
        or email{" "}
        <a className="font-semibold underline" href={`mailto:${contact.emails[0]}`}>
          {contact.emails[0]}
        </a>
        .
      </>
    );

    if (honeypot || Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus("error");
      setErrorMsg(<>We couldn't send your request. {fallback}</>);
      return;
    }

    setStatus("loading");
    setErrorMsg(null);
    try {
      await submitEnquiry(values);
      setStatus("success");
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof EnquiryNotConfigured ? (
          <>Online demo requests aren't available right now. {fallback}</>
        ) : (
          <>Something went wrong and your request was not sent. Please try again, or {fallback}</>
        ),
      );
    }
  };

  return (
    <section id="demo" className="bg-mist py-24 text-ink lg:py-32" aria-labelledby="demo-title">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <span className="eyebrow-light">Demo Enquiry</span>
          <h2 id="demo-title" className="h2 mt-4">
            Book a free, personalised product demo
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Share a few details and our team will walk you through the modules that fit your outlets, workflows and
            reporting needs.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "A walkthrough tailored to your business type",
              "Guidance on the right modules for your outlets",
              "Answers on setup, training and support",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-blue" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <p className="font-semibold">Prefer to talk directly?</p>
            <a href={`tel:${contact.sales.tel}`} className="flex items-center gap-2.5 text-slate-600 hover:text-accent-blue">
              <Phone size={16} className="text-accent-blue" /> Sales: {contact.sales.phone}
            </a>
            <a href={`tel:${contact.support.tel}`} className="flex items-center gap-2.5 text-slate-600 hover:text-accent-blue">
              <Phone size={16} className="text-accent-blue" /> Support: {contact.support.phone}
            </a>
            <a href={`mailto:${contact.emails[0]}`} className="flex items-center gap-2.5 break-all text-slate-600 hover:text-accent-blue">
              <Mail size={16} className="shrink-0 text-accent-blue" /> {contact.emails[0]}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
            aria-describedby="form-status"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="fullName" label="Full Name" error={errors.fullName}>
                <input type="text" autoComplete="name" placeholder="Your full name" {...props("fullName")} />
              </Field>
              <Field id="email" label="Work Email" error={errors.email}>
                <input type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" {...props("email")} />
              </Field>
              <Field id="phone" label="Phone Number" error={errors.phone}>
                <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98XXX XXXXX" {...props("phone")} />
              </Field>
              <Field id="company" label="Company or Brand Name" error={errors.company}>
                <input type="text" autoComplete="organization" placeholder="Brand / company" {...props("company")} />
              </Field>
              <Field id="industry" label="Industry / Business Type" error={errors.industry}>
                <select {...props("industry")}>
                  <option value="">Select business type</option>
                  {industryOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field id="outlets" label="Number of Outlets" error={errors.outlets}>
                <select {...props("outlets")}>
                  <option value="">Select</option>
                  {outletOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field id="city" label="City" error={errors.city}>
                <input type="text" autoComplete="address-level2" placeholder="e.g. Pune" {...props("city")} />
              </Field>
              <Field id="product" label="Product of Interest" error={errors.product}>
                <select {...props("product")}>
                  <option value="">Select a product</option>
                  {productOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field id="message" label="Message" optional error={errors.message} full>
                <textarea rows={4} placeholder="Tell us about your outlets and what you'd like to improve" {...props("message")} />
              </Field>
            </div>

            {/* Honeypot: hidden from people, often filled by bots */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={status === "loading" ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-blue to-[#2563EB] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,.8)] transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending…
                </>
              ) : (
                "Request My Demo"
              )}
            </motion.button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={14} /> Your details are used only to respond to this enquiry.
            </p>

            <div id="form-status" role="status" aria-live="polite">
              <AnimatePresence>
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 flex items-start gap-2.5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> Thank you — your demo request has been received.
                    Our team will contact you shortly.
                  </motion.p>
                )}
                {status === "error" && errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 flex items-start gap-2.5 rounded-xl bg-rose-50 p-4 text-sm text-rose-800"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
