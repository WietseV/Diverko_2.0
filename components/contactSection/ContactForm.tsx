"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("submitting");
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setState("success");
        event.currentTarget.reset();
      } else {
        const data = await response.json();
        throw new Error(data?.message ?? "Failed to submit form");
      }
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-primary_dark/10 bg-primary_light/20 p-6 text-primary_dark"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em] text-primary_dark/60">
          Name
          <input
            type="text"
            name="name"
            required
            className="rounded-2xl border border-primary_dark/10 bg-white px-3 py-2 text-base text-primary_dark focus:border-secondary focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em] text-primary_dark/60">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-2xl border border-primary_dark/10 bg-white px-3 py-2 text-base text-primary_dark focus:border-secondary focus:outline-none"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em] text-primary_dark/60">
        Message
        <textarea
          name="message"
          rows={5}
          required
          className="rounded-2xl border border-primary_dark/10 bg-white px-3 py-2 text-base text-primary_dark focus:border-secondary focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-full bg-secondary py-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary_dark transition hover:bg-secondary/90 disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Send message"}
      </button>
      {state === "success" ? <p className="text-sm text-secondary">Thanks! We&apos;ll be in touch shortly.</p> : null}
      {state === "error" && error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
