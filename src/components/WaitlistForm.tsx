import { useState } from "react";

const INDUSTRIES = [
  "E-commerce",
  "Hotels",
  "Clinics",
  "Restaurants",
  "Coaches",
  "Agencies",
  "Other",
];

/**
 * WaitlistForm — lead-capture form for early access signups.
 *
 * Client-side only for now: on submit we validate and show a success state.
 * Nothing is sent, stored, or emailed.
 *
 * TODO(server): plug server-side wiring in here when the backend exists —
 * e.g. `await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({
 * name, email, business, industry }) })` — then render the success state only
 * after the server confirms the signup. Until then, the code below is the
 * full extent of the form.
 */
export function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [industry, setIndustry] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!industry) {
      setError("Please choose your industry.");
      return;
    }
    setError("");
    // TODO(server): server-side wiring plugs in here (see note above).
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <div className="text-4xl">🎉</div>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          You're on the list!
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
          Thanks{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""} — we'll
          reach out when SalesAgent AI opens for early access.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="wl-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Your name
          </label>
          <input
            id="wl-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              // Drop the validation message as soon as the user starts editing.
              setError("");
            }}
            placeholder="Jane Smith"
            autoComplete="name"
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label
            htmlFor="wl-email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Business email
          </label>
          <input
            id="wl-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="jane@yourbusiness.com"
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label
            htmlFor="wl-business"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Business name{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="wl-business"
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Smith & Co."
            autoComplete="organization"
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label
            htmlFor="wl-industry"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Industry
          </label>
          <select
            id="wl-industry"
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              setError("");
            }}
            className="h-11 w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="" disabled>
              Select your industry
            </option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Join the waitlist
        </button>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">
        Preview form — nothing is sent or stored yet. Server-side signup arrives
        with our first release.
      </p>
    </form>
  );
}
