"use client";

import { useState } from "react";
import Button from "./Button";

export default function ContactForm({email}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'error'
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in name, email and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    // Frontend-only contact: no contact API on backend — simulate success UX
    // and open mailto as a practical handoff.
    try {
      await new Promise((r) => setTimeout(r, 600));
      const body = encodeURIComponent(
        `Name: ${form.name}\nPhone: ${form.phone || "—"}\n\n${form.message}`
      );
      const subject = encodeURIComponent(form.subject || "Mughal Store inquiry");
      // Optional: user can still use mailto; we show success in UI
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setError("Something went wrong. Please email us directly.");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-surface-border bg-surface-base px-4 py-3 text-sm text-content-main placeholder:text-content-muted focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-accent-danger-soft px-4 py-3 text-sm text-accent-danger">
          {error}
        </div>
      )}
      {status === "ok" && (
        <div className="rounded-xl bg-accent-success-soft px-4 py-3 text-sm text-accent-success">
          Thank you. Your message is ready — complete sending in your email app, or write to us at {email}.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-content-muted">
            Name *
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-content-muted">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={fieldClass}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-content-muted">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={fieldClass}
            placeholder="+92 300 0000000"
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-content-muted">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Order, product, partnership…"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-content-muted">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={`${fieldClass} resize-y min-h-[120px]`}
          placeholder="How can we help you?"
          required
        />
      </div>

      <Button type="submit" loading={status === "sending"} className="w-full sm:w-auto min-w-[160px]">
        Send message
      </Button>
    </form>
  );
}
