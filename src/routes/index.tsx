import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DemoChat } from "~/components/DemoChat";
import { WaitlistForm } from "~/components/WaitlistForm";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  // "Try the demo": open the chat widget and bring the demo section into view.
  function openDemo() {
    setChatOpen(true);
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-dvh bg-white text-gray-900">
      <Nav onOpenDemo={openDemo} />
      <main>
        <Hero onOpenDemo={openDemo} />
        <Features />
        <Industries />
        <Pricing />
        <DemoSection onOpenChat={() => setChatOpen(true)} />
        <WaitlistSection />
      </main>
      <Footer />
      <DemoChat open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}

/* --- Nav --------------------------------------------------------------- */

function Nav({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ChatGlyph className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">SalesAgent AI</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          <a href="#features" className="transition hover:text-gray-900">
            What it does
          </a>
          <a href="#industries" className="transition hover:text-gray-900">
            Industries
          </a>
          <a href="#pricing" className="transition hover:text-gray-900">
            Pricing
          </a>
          <a href="#demo" className="transition hover:text-gray-900">
            Demo
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDemo}
            className="hidden text-sm font-medium text-gray-700 transition hover:text-gray-900 sm:block"
          >
            Try the demo
          </button>
          <a
            href="#waitlist"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </header>
  );
}

/* --- Hero -------------------------------------------------------------- */

function Hero({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-100/80 blur-3xl" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(99,102,241,0.09)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32 sm:pb-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Early-access waitlist is open
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
          The AI sales agent for{" "}
          <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            small businesses
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-gray-600 sm:text-xl">
          SalesAgent AI lives on your website and answers every visitor, 24/7 —
          capturing leads, booking appointments, recommending products, and
          following up automatically. Never miss another sale, even while you
          sleep.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onOpenDemo}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Try the demo
            <ArrowGlyph className="h-4 w-4" />
          </button>
          <a
            href="#waitlist"
            className="inline-flex h-12 items-center justify-center rounded-full border border-gray-300 bg-white px-7 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            Join the waitlist
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          The floating chat button at the bottom of this page? That's the
          product — give it a click.
        </p>
      </div>
    </section>
  );
}

/* --- Shared bits ------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* --- What it does ------------------------------------------------------ */

const FEATURES = [
  {
    title: "24/7 visitor chat",
    desc: "Answers every visitor the moment they arrive — nights, weekends, and holidays included.",
    d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  },
  {
    title: "Lead capture",
    desc: "Collects names, emails, and phone numbers automatically — every conversation becomes a lead you can act on.",
    d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
  },
  {
    title: "Appointment booking",
    desc: "Checks availability and books appointments, tables, or rooms right inside the chat.",
    d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    title: "Automatic follow-ups",
    desc: "Follows up with leads automatically until they're ready — no spreadsheets, no manual outreach.",
    d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    title: "Product recommendations",
    desc: "Recommends the right products or upgrades based on what each visitor is actually asking about.",
    d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="What it does"
          title="A full sales team, in one chat widget"
          subtitle="Your website visitors get instant, helpful answers — and you get every conversation captured as a lead, automatically."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5.5 w-5.5"
                >
                  <path d={f.d} />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Industries -------------------------------------------------------- */

const INDUSTRIES = [
  {
    emoji: "🛒",
    name: "E-commerce",
    line: "Recommend products and turn browsing into checkouts.",
  },
  {
    emoji: "🏨",
    name: "Hotels",
    line: "Answer room questions and take reservations 24/7.",
  },
  {
    emoji: "🩺",
    name: "Clinics",
    line: "Book appointments and collect patient details.",
  },
  {
    emoji: "🍽️",
    name: "Restaurants",
    line: "Take reservations and answer menu questions.",
  },
  {
    emoji: "🎯",
    name: "Coaches",
    line: "Qualify leads and schedule intro calls.",
  },
  {
    emoji: "🏢",
    name: "Agencies",
    line: "Handle client inquiries and book discovery calls.",
  },
];

function Industries() {
  return (
    <section id="industries" className="scroll-mt-20 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Industries"
          title="Built for the businesses that serve people directly"
          subtitle="If your customers ask questions before they buy, SalesAgent AI fits."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <div
              key={i.name}
              className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6 text-center transition hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <div className="text-3xl">{i.emoji}</div>
              <h3 className="mt-3 text-base font-semibold text-gray-900">
                {i.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {i.line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Pricing ----------------------------------------------------------- */

const PLANS = [
  {
    name: "Core",
    blurb: "For a single business",
    points: [
      "Monthly subscription",
      "Usage-based AI credits",
      "Chat widget on your website",
      "Lead capture & automatic follow-ups",
    ],
  },
  {
    name: "White-label",
    blurb: "For agencies & studios",
    featured: true,
    points: [
      "Everything in Core",
      "Your brand, logo & colors",
      "Serve from your own domain",
      "Volume credit pricing",
    ],
  },
  {
    name: "Agency reseller",
    blurb: "For growing agencies",
    points: [
      "Resell to your client roster",
      "Partner pricing",
      "Dedicated support",
      "Early access to new features",
    ],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, usage-based pricing"
          subtitle="Every plan starts with a monthly subscription and runs on AI credits — you pay for the conversations you actually have, not a huge upfront fee."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={
                p.featured
                  ? "relative rounded-2xl border-2 border-indigo-600 bg-white p-7 shadow-md"
                  : "rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
              }
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{p.blurb}</p>
              <ul className="mt-5 space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckGlyph className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-gray-500">
          Exact pricing isn't set yet — join the waitlist and we'll share the
          details first, before anyone else.
        </p>
      </div>
    </section>
  );
}

/* --- Demo section ------------------------------------------------------ */

const DEMO_STEPS = [
  {
    step: "1",
    title: "Ask about a room",
    line: "Type a question or tap a suggestion — the agent answers instantly.",
  },
  {
    step: "2",
    title: "Book a stay",
    line: "The agent takes the booking and asks for just two details.",
  },
  {
    step: "3",
    title: "Watch the lead",
    line: "Name and email are captured as a lead, and an upgrade is offered.",
  },
];

function DemoSection({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <section
      id="demo"
      className="scroll-mt-20 border-t border-gray-100 bg-indigo-50/50"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Live demo"
          title="See it in action"
          subtitle="This is a scripted demo — try the widget exactly the way a visitor would. It works on desktop and mobile."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {DEMO_STEPS.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-3 text-base font-semibold text-gray-900">
                {s.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {s.line}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={onOpenChat}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Open the demo chat
            <ChatGlyph className="h-4 w-4" />
          </button>
          <p className="text-sm text-gray-500">
            Simulated conversation — scripted responses, no live AI, no data
            collected.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --- Waitlist ---------------------------------------------------------- */

function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-20 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Early access
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Join the waitlist
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-gray-600">
              Be among the first to try SalesAgent AI when early access opens.
              We'll share pricing as soon as it's set, and let you know the
              moment you can put it on your site.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Early-access invites as they open up",
                "Pricing details before public launch",
                "No spam — unsubscribe anytime",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckGlyph className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Footer ------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 pb-28 pt-12 sm:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-start">
          <div className="max-w-xs text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ChatGlyph className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                SalesAgent AI
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              The AI sales agent for small businesses — answers every visitor,
              24/7.
            </p>
          </div>
          <div className="flex gap-16 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Product</p>
              <ul className="mt-3 space-y-2 text-gray-500">
                <li>
                  <a href="#features" className="transition hover:text-gray-900">
                    What it does
                  </a>
                </li>
                <li>
                  <a href="#industries" className="transition hover:text-gray-900">
                    Industries
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition hover:text-gray-900">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Company</p>
              <ul className="mt-3 space-y-2 text-gray-500">
                <li>
                  <a href="#demo" className="transition hover:text-gray-900">
                    Live demo
                  </a>
                </li>
                <li>
                  <a href="#waitlist" className="transition hover:text-gray-900">
                    Join the waitlist
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} SalesAgent AI. All rights reserved.</p>
          <p>
            Built with{" "}
            <a
              href="https://cto.new"
              className="underline transition hover:text-gray-600"
            >
              cto.new
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* --- Icons ------------------------------------------------------------- */

function IconBase({
  className,
  d,
}: {
  className?: string;
  d: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
    >
      <path d={d} />
    </svg>
  );
}

function ChatGlyph({ className }: { className?: string }) {
  return (
    <IconBase
      className={className}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  );
}

function ArrowGlyph({ className }: { className?: string }) {
  return <IconBase className={className} d="M17 8l4 4m0 0l-4 4m4-4H3" />;
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <IconBase className={className} d="M5 13l4 4L19 7" />
  );
}
