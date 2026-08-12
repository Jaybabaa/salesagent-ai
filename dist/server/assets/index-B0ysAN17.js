import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
const NODES = {
  greeting: {
    text: "Hi there! 👋 I'm Ava, the AI sales agent for Oceanview Grand Hotel. I can check room availability, take a booking, and answer questions — 24/7. How can I help?",
    replies: [
      { label: "Check availability", next: "availability" },
      { label: "Book a room", next: "book-start" },
      { label: "Ask a question", next: "faq" }
    ]
  },
  fallback: {
    text: "I'm a scripted demo, so I can only follow the options below — but that's exactly how a real SalesAgent AI keeps the conversation moving. Tap a suggestion to continue!",
    replies: [
      { label: "Check availability", next: "availability" },
      { label: "Book a room", next: "book-start" },
      { label: "Ask a question", next: "faq" }
    ]
  },
  availability: {
    text: "Great news — the Deluxe Sea-View Room is available for your dates: $189/night, breakfast included. Would you like me to reserve it for you?",
    replies: [
      { label: "Yes, book it", next: "capture-name" },
      { label: "Show me other options", next: "other-options" },
      { label: "Payment & cancellation", next: "payment" }
    ]
  },
  "book-start": {
    text: "Happy to help! Let me check availability first — good news, the Deluxe Sea-View Room is open for your dates at $189/night, breakfast included. Shall I reserve it?",
    replies: [
      { label: "Yes, book it", next: "capture-name" },
      { label: "Show me other options", next: "other-options" }
    ]
  },
  "other-options": {
    text: "We also have the Garden Twin at $149/night and the Oceanview Suite at $289/night. Which would you like?",
    replies: [
      { label: "Book the Garden Twin", next: "capture-name" },
      { label: "Book the Oceanview Suite", next: "capture-name" },
      { label: "Stick with the Deluxe", next: "capture-name" }
    ]
  },
  payment: {
    text: "All payments are handled securely at checkout — we take every major card, and you can cancel free of charge up to 48 hours before arrival. Shall I reserve the Deluxe room for you?",
    replies: [
      { label: "Yes, reserve it", next: "capture-name" },
      { label: "Show me other options", next: "other-options" }
    ]
  },
  faq: {
    text: "Ask away — I know our rooms, amenities, and policies inside out. What would you like to know?",
    replies: [
      { label: "What time is checkout?", next: "faq-checkout" },
      { label: "Is parking available?", next: "faq-parking" },
      { label: "Just book a room", next: "book-start" }
    ]
  },
  "faq-checkout": {
    text: "Checkout is at 11:00am — and we offer late checkout until 2pm for a small fee. Anything else I can help with?",
    replies: [
      { label: "Is parking available?", next: "faq-parking" },
      { label: "Book a room", next: "book-start" },
      { label: "That's all, thanks", next: "thanks" }
    ]
  },
  "faq-parking": {
    text: "Yes — free on-site parking for all guests, no reservation needed. Anything else?",
    replies: [
      { label: "What time is checkout?", next: "faq-checkout" },
      { label: "Book a room", next: "book-start" },
      { label: "That's all, thanks", next: "thanks" }
    ]
  },
  "capture-name": {
    text: "Wonderful choice! 🎉 Just a couple of quick details so I can secure the reservation — what name should I put it under?"
  },
  "capture-email": {
    text: "Thanks, {name}! And what email should I attach to the reservation?"
  },
  confirm: {
    text: "Perfect — you're all set, {name}! I've reserved the Deluxe Sea-View Room for 2 nights and attached your details ({email}) to the reservation. One more thing: our guests love the breakfast upgrade (+$15/night). Want me to add it?",
    replies: [
      { label: "Yes, add breakfast", next: "upgrade-added" },
      { label: "No, thanks", next: "booked-final" }
    ]
  },
  "upgrade-added": {
    text: "Done! 🥐 Breakfast is added to your stay. Here's your reservation: 2 nights in the Deluxe Sea-View Room with breakfast, confirmed under {name}. Anything else I can help with?",
    replies: [
      { label: "That's all, thanks", next: "thanks" },
      { label: "Restart demo", next: "restart" }
    ]
  },
  "booked-final": {
    text: "No problem! Your reservation is confirmed under {name}: 2 nights in the Deluxe Sea-View Room. Anything else I can help with?",
    replies: [
      { label: "That's all, thanks", next: "thanks" },
      { label: "Restart demo", next: "restart" }
    ]
  },
  thanks: {
    text: "It was a pleasure helping you, {name}! 👋 I'm here 24/7 whenever you need me. A real SalesAgent AI would also follow up automatically — a reminder before you arrive, then a review request after checkout. Want to start over?",
    replies: [{ label: "Restart demo", next: "restart" }]
  },
  restart: { text: "" }
};
function DemoChat({ open, onOpenChange }) {
  const [booted, setBooted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState("greeting");
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState({ name: "", email: "" });
  const timersRef = useRef([]);
  const idRef = useRef(0);
  const scrollRef = useRef(null);
  const openRef = useRef(open);
  function schedule(fn, ms) {
    const t = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((x) => x !== t);
      if (!openRef.current) return;
      fn();
    }, ms);
    timersRef.current.push(t);
  }
  function pushMessage(role, text) {
    idRef.current += 1;
    setMessages((prev) => [...prev, { id: idRef.current, role, text }]);
  }
  function say(nodeId, overrides) {
    let text = NODES[nodeId].text;
    const name = overrides?.name ?? lead.name;
    const email = overrides?.email ?? lead.email;
    if (name) text = text.replaceAll("{name}", name);
    if (email) text = text.replaceAll("{email}", email);
    pushMessage("agent", text);
  }
  function greet() {
    setCurrentNode("greeting");
    setTyping(true);
    schedule(() => {
      setTyping(false);
      say("greeting");
    }, 900);
  }
  function resetChat() {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    setMessages([]);
    setLead({ name: "", email: "" });
    setInput("");
    greet();
  }
  useEffect(() => {
    if (open && !booted) {
      setBooted(true);
      greet();
    } else if (open && booted && messages.length === 0 && !typing) {
      greet();
    }
  }, [open, booted, messages.length, typing]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);
  useEffect(() => {
    if (!open) {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
      setTyping(false);
    }
  }, [open]);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);
  function goTo(next, userText) {
    if (typing) return;
    pushMessage("user", userText);
    if (next === "restart") {
      resetChat();
      return;
    }
    setCurrentNode(next);
    setTyping(true);
    schedule(() => {
      setTyping(false);
      say(next);
    }, 750 + Math.random() * 450);
  }
  function handleReply(reply) {
    goTo(reply.next, reply.label);
  }
  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    if (currentNode === "capture-name") {
      pushMessage("user", text);
      setLead((l) => ({ ...l, name: text }));
      setCurrentNode("capture-email");
      setTyping(true);
      schedule(() => {
        setTyping(false);
        say("capture-email", { name: text });
      }, 800);
      return;
    }
    if (currentNode === "capture-email") {
      if (!text.includes("@") || text.length < 5) {
        pushMessage("user", text);
        setTyping(true);
        schedule(() => {
          setTyping(false);
          pushMessage(
            "agent",
            "Hmm, that doesn't look like an email address — mind double-checking? I just need it to attach to your reservation."
          );
        }, 800);
        return;
      }
      pushMessage("user", text);
      setLead((l) => ({ ...l, email: text }));
      pushMessage(
        "system",
        `📥 Lead captured — Ava saved ${lead.name} · ${text} as a new lead`
      );
      setCurrentNode("confirm");
      setTyping(true);
      schedule(() => {
        setTyping(false);
        say("confirm", { name: lead.name, email: text });
      }, 850);
      return;
    }
    goTo("fallback", text);
  }
  const node = NODES[currentNode];
  const showChips = !typing && !!node.replies && node.replies.length > 0;
  const placeholder = currentNode === "capture-name" ? "Type your name…" : currentNode === "capture-email" ? "Type your email…" : "Type a message…";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onOpenChange(!open),
        "aria-label": open ? "Close demo chat" : "Open demo chat",
        className: open ? "fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500 sm:bottom-5 sm:right-6" : "pulse-ring fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:scale-105 hover:bg-indigo-500 sm:bottom-5 sm:right-6",
        children: open ? /* @__PURE__ */ jsx(CloseIcon, {}) : /* @__PURE__ */ jsx(ChatIcon, {})
      }
    ),
    open && /* @__PURE__ */ jsxs(
      "div",
      {
        role: "dialog",
        "aria-label": "SalesAgent AI demo chat",
        className: "chat-pop fixed bottom-20 left-1/2 z-50 flex h-[min(68dvh,560px)] w-[min(400px,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:bottom-24 sm:left-auto sm:right-6 sm:translate-x-0",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-indigo-600 px-4 py-3 text-white", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20", children: /* @__PURE__ */ jsx(ChatIcon, { className: "h-4.5 w-4.5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold", children: "SalesAgent AI" }),
                /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", children: "Demo" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-indigo-100", children: "Ava · Oceanview Grand Hotel · Online" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: resetChat,
                title: "Restart demo",
                "aria-label": "Restart demo",
                className: "rounded-full p-1.5 transition hover:bg-white/15",
                children: /* @__PURE__ */ jsx(ResetIcon, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onOpenChange(false),
                title: "Close chat",
                "aria-label": "Close chat",
                className: "rounded-full p-1.5 transition hover:bg-white/15",
                children: /* @__PURE__ */ jsx(CloseIcon, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: scrollRef,
              className: "flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4",
              children: [
                messages.map((m) => {
                  if (m.role === "system") {
                    return /* @__PURE__ */ jsx("div", { className: "msg-in flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-gray-200/90 px-3 py-1 text-center text-[11px] font-medium text-gray-600", children: m.text }) }, m.id);
                  }
                  const isUser = m.role === "user";
                  return /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "msg-in flex " + (isUser ? "justify-end" : "justify-start"),
                      children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: isUser ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm" : "max-w-[85%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm",
                          children: m.text
                        }
                      )
                    },
                    m.id
                  );
                }),
                typing && /* @__PURE__ */ jsx("div", { className: "msg-in flex justify-start", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-3 shadow-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "typing-dot" }),
                  /* @__PURE__ */ jsx("span", { className: "typing-dot" }),
                  /* @__PURE__ */ jsx("span", { className: "typing-dot" })
                ] }) })
              ]
            }
          ),
          showChips && node.replies && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 bg-white px-4 pb-2 pt-1", children: node.replies.map((r) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => handleReply(r),
              className: "rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100",
              children: r.label
            },
            r.label
          )) }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSend, className: "flex items-center gap-2 bg-white p-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder,
                disabled: typing,
                "aria-label": "Type a message",
                className: "h-10 min-w-0 flex-1 rounded-full border border-gray-300 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: typing || !input.trim(),
                "aria-label": "Send message",
                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600",
                children: /* @__PURE__ */ jsx(SendIcon, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "border-t border-gray-100 bg-gray-50 px-4 py-2 text-center text-[11px] text-gray-400", children: "Demo — scripted responses from a fictional hotel, not a live AI. No data is sent or stored." })
        ]
      }
    )
  ] });
}
function IconBase$1({
  className,
  d
}) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.7,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className: className ?? "h-5 w-5",
      children: /* @__PURE__ */ jsx("path", { d })
    }
  );
}
function ChatIcon({ className }) {
  return /* @__PURE__ */ jsx(
    IconBase$1,
    {
      className,
      d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    }
  );
}
function CloseIcon({ className }) {
  return /* @__PURE__ */ jsx(IconBase$1, { className, d: "M6 18L18 6M6 6l12 12" });
}
function ResetIcon({ className }) {
  return /* @__PURE__ */ jsx(
    IconBase$1,
    {
      className,
      d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    }
  );
}
function SendIcon({ className }) {
  return /* @__PURE__ */ jsx(IconBase$1, { className, d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" });
}
const INDUSTRIES$1 = [
  "E-commerce",
  "Hotels",
  "Clinics",
  "Restaurants",
  "Coaches",
  "Agencies",
  "Other"
];
function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [industry, setIndustry] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(e) {
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
    setSubmitted(true);
  }
  if (submitted) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl", children: "🎉" }),
      /* @__PURE__ */ jsx("h3", { className: "mt-3 text-lg font-semibold text-gray-900", children: "You're on the list!" }),
      /* @__PURE__ */ jsxs("p", { className: "mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600", children: [
        "Thanks",
        name.trim() ? `, ${name.trim().split(" ")[0]}` : "",
        " — we'll reach out when SalesAgent AI opens for early access."
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setSubmitted(false),
          className: "mt-5 text-sm font-medium text-indigo-600 transition hover:text-indigo-500",
          children: "Submit another response"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "wl-name",
            className: "mb-1.5 block text-sm font-medium text-gray-700",
            children: "Your name"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "wl-name",
            type: "text",
            value: name,
            onChange: (e) => {
              setName(e.target.value);
              setError("");
            },
            placeholder: "Jane Smith",
            autoComplete: "name",
            className: "h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "wl-email",
            className: "mb-1.5 block text-sm font-medium text-gray-700",
            children: "Business email"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "wl-email",
            type: "email",
            value: email,
            onChange: (e) => {
              setEmail(e.target.value);
              setError("");
            },
            placeholder: "jane@yourbusiness.com",
            autoComplete: "email",
            className: "h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: "wl-business",
            className: "mb-1.5 block text-sm font-medium text-gray-700",
            children: [
              "Business name",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: "(optional)" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "wl-business",
            type: "text",
            value: business,
            onChange: (e) => setBusiness(e.target.value),
            placeholder: "Smith & Co.",
            autoComplete: "organization",
            className: "h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "wl-industry",
            className: "mb-1.5 block text-sm font-medium text-gray-700",
            children: "Industry"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "wl-industry",
            value: industry,
            onChange: (e) => {
              setIndustry(e.target.value);
              setError("");
            },
            className: "h-11 w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select your industry" }),
              INDUSTRIES$1.map((i) => /* @__PURE__ */ jsx("option", { value: i, children: i }, i))
            ]
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-sm font-medium text-red-600", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          children: "Join the waitlist"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-xs leading-relaxed text-gray-400", children: "Preview form — nothing is sent or stored yet. Server-side signup arrives with our first release." })
  ] });
}
function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  function openDemo() {
    setChatOpen(true);
    document.getElementById("demo")?.scrollIntoView({
      behavior: "smooth"
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-white text-gray-900", children: [
    /* @__PURE__ */ jsx(Nav, { onOpenDemo: openDemo }),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(Hero, { onOpenDemo: openDemo }),
      /* @__PURE__ */ jsx(Features, {}),
      /* @__PURE__ */ jsx(Industries, {}),
      /* @__PURE__ */ jsx(Pricing, {}),
      /* @__PURE__ */ jsx(DemoSection, { onOpenChat: () => setChatOpen(true) }),
      /* @__PURE__ */ jsx(WaitlistSection, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(DemoChat, { open: chatOpen, onOpenChange: setChatOpen })
  ] });
}
function Nav({
  onOpenDemo
}) {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxs("a", { href: "#", className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white", children: /* @__PURE__ */ jsx(ChatGlyph, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold tracking-tight", children: "SalesAgent AI" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex", children: [
      /* @__PURE__ */ jsx("a", { href: "#features", className: "transition hover:text-gray-900", children: "What it does" }),
      /* @__PURE__ */ jsx("a", { href: "#industries", className: "transition hover:text-gray-900", children: "Industries" }),
      /* @__PURE__ */ jsx("a", { href: "#pricing", className: "transition hover:text-gray-900", children: "Pricing" }),
      /* @__PURE__ */ jsx("a", { href: "#demo", className: "transition hover:text-gray-900", children: "Demo" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: onOpenDemo, className: "hidden text-sm font-medium text-gray-700 transition hover:text-gray-900 sm:block", children: "Try the demo" }),
      /* @__PURE__ */ jsx("a", { href: "#waitlist", className: "rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500", children: "Join the waitlist" })
    ] })
  ] }) });
}
function Hero({
  onOpenDemo
}) {
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-100/80 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -right-24 top-32 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle,rgba(99,102,241,0.09)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32 sm:pb-24", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700", children: [
        /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-indigo-500" }),
        "Early-access waitlist is open"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl", children: [
        "The AI sales agent for",
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent", children: "small businesses" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-gray-600 sm:text-xl", children: "SalesAgent AI lives on your website and answers every visitor, 24/7 — capturing leads, booking appointments, recommending products, and following up automatically. Never miss another sale, even while you sleep." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ jsxs("button", { onClick: onOpenDemo, className: "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", children: [
          "Try the demo",
          /* @__PURE__ */ jsx(ArrowGlyph, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsx("a", { href: "#waitlist", className: "inline-flex h-12 items-center justify-center rounded-full border border-gray-300 bg-white px-7 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50", children: "Join the waitlist" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-gray-400", children: "The floating chat button at the bottom of this page? That's the product — give it a click." })
    ] })
  ] });
}
function SectionHeading({
  eyebrow,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-widest text-indigo-600", children: eyebrow }),
    /* @__PURE__ */ jsx("h2", { className: "mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl", children: title }),
    subtitle && /* @__PURE__ */ jsx("p", { className: "mt-4 text-pretty text-lg leading-relaxed text-gray-600", children: subtitle })
  ] });
}
const FEATURES = [{
  title: "24/7 visitor chat",
  desc: "Answers every visitor the moment they arrive — nights, weekends, and holidays included.",
  d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
}, {
  title: "Lead capture",
  desc: "Collects names, emails, and phone numbers automatically — every conversation becomes a lead you can act on.",
  d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
}, {
  title: "Appointment booking",
  desc: "Checks availability and books appointments, tables, or rooms right inside the chat.",
  d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
}, {
  title: "Automatic follow-ups",
  desc: "Follows up with leads automatically until they're ready — no spreadsheets, no manual outreach.",
  d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
}, {
  title: "Product recommendations",
  desc: "Recommends the right products or upgrades based on what each visitor is actually asking about.",
  d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
}];
function Features() {
  return /* @__PURE__ */ jsx("section", { id: "features", className: "scroll-mt-20 border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24", children: [
    /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "What it does", title: "A full sales team, in one chat widget", subtitle: "Your website visitors get instant, helpful answers — and you get every conversation captured as a lead, automatically." }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: FEATURES.map((f) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: "h-5.5 w-5.5", children: /* @__PURE__ */ jsx("path", { d: f.d }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "mt-4 text-base font-semibold text-gray-900", children: f.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-gray-600", children: f.desc })
    ] }, f.title)) })
  ] }) });
}
const INDUSTRIES = [{
  emoji: "🛒",
  name: "E-commerce",
  line: "Recommend products and turn browsing into checkouts."
}, {
  emoji: "🏨",
  name: "Hotels",
  line: "Answer room questions and take reservations 24/7."
}, {
  emoji: "🩺",
  name: "Clinics",
  line: "Book appointments and collect patient details."
}, {
  emoji: "🍽️",
  name: "Restaurants",
  line: "Take reservations and answer menu questions."
}, {
  emoji: "🎯",
  name: "Coaches",
  line: "Qualify leads and schedule intro calls."
}, {
  emoji: "🏢",
  name: "Agencies",
  line: "Handle client inquiries and book discovery calls."
}];
function Industries() {
  return /* @__PURE__ */ jsx("section", { id: "industries", className: "scroll-mt-20 border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24", children: [
    /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Industries", title: "Built for the businesses that serve people directly", subtitle: "If your customers ask questions before they buy, SalesAgent AI fits." }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: INDUSTRIES.map((i) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-gray-50/60 p-6 text-center transition hover:border-indigo-200 hover:bg-indigo-50/40", children: [
      /* @__PURE__ */ jsx("div", { className: "text-3xl", children: i.emoji }),
      /* @__PURE__ */ jsx("h3", { className: "mt-3 text-base font-semibold text-gray-900", children: i.name }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed text-gray-600", children: i.line })
    ] }, i.name)) })
  ] }) });
}
const PLANS = [{
  name: "Core",
  blurb: "For a single business",
  points: ["Monthly subscription", "Usage-based AI credits", "Chat widget on your website", "Lead capture & automatic follow-ups"]
}, {
  name: "White-label",
  blurb: "For agencies & studios",
  featured: true,
  points: ["Everything in Core", "Your brand, logo & colors", "Serve from your own domain", "Volume credit pricing"]
}, {
  name: "Agency reseller",
  blurb: "For growing agencies",
  points: ["Resell to your client roster", "Partner pricing", "Dedicated support", "Early access to new features"]
}];
function Pricing() {
  return /* @__PURE__ */ jsx("section", { id: "pricing", className: "scroll-mt-20 border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24", children: [
    /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Pricing", title: "Simple, usage-based pricing", subtitle: "Every plan starts with a monthly subscription and runs on AI credits — you pay for the conversations you actually have, not a huge upfront fee." }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-5 lg:grid-cols-3", children: PLANS.map((p) => /* @__PURE__ */ jsxs("div", { className: p.featured ? "relative rounded-2xl border-2 border-indigo-600 bg-white p-7 shadow-md" : "rounded-2xl border border-gray-200 bg-white p-7 shadow-sm", children: [
      p.featured && /* @__PURE__ */ jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white", children: "Popular" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900", children: p.name }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: p.blurb }),
      /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-2.5", children: p.points.map((pt) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5 text-sm text-gray-700", children: [
        /* @__PURE__ */ jsx(CheckGlyph, { className: "mt-0.5 h-4 w-4 shrink-0 text-indigo-600" }),
        pt
      ] }, pt)) })
    ] }, p.name)) }),
    /* @__PURE__ */ jsx("p", { className: "mx-auto mt-8 max-w-xl text-center text-sm text-gray-500", children: "Exact pricing isn't set yet — join the waitlist and we'll share the details first, before anyone else." })
  ] }) });
}
const DEMO_STEPS = [{
  step: "1",
  title: "Ask about a room",
  line: "Type a question or tap a suggestion — the agent answers instantly."
}, {
  step: "2",
  title: "Book a stay",
  line: "The agent takes the booking and asks for just two details."
}, {
  step: "3",
  title: "Watch the lead",
  line: "Name and email are captured as a lead, and an upgrade is offered."
}];
function DemoSection({
  onOpenChat
}) {
  return /* @__PURE__ */ jsx("section", { id: "demo", className: "scroll-mt-20 border-t border-gray-100 bg-indigo-50/50", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24", children: [
    /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Live demo", title: "See it in action", subtitle: "This is a scripted demo — try the widget exactly the way a visitor would. It works on desktop and mobile." }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-4 sm:grid-cols-3", children: DEMO_STEPS.map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white", children: s.step }),
      /* @__PURE__ */ jsx("h3", { className: "mt-3 text-base font-semibold text-gray-900", children: s.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed text-gray-600", children: s.line })
    ] }, s.step)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxs("button", { onClick: onOpenChat, className: "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", children: [
        "Open the demo chat",
        /* @__PURE__ */ jsx(ChatGlyph, { className: "h-4 w-4" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Simulated conversation — scripted responses, no live AI, no data collected." })
    ] })
  ] }) });
}
function WaitlistSection() {
  return /* @__PURE__ */ jsx("section", { id: "waitlist", className: "scroll-mt-20 border-t border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-12 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-widest text-indigo-600", children: "Early access" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl", children: "Join the waitlist" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-pretty text-lg leading-relaxed text-gray-600", children: "Be among the first to try SalesAgent AI when early access opens. We'll share pricing as soon as it's set, and let you know the moment you can put it on your site." }),
      /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3", children: ["Early-access invites as they open up", "Pricing details before public launch", "No spam — unsubscribe anytime"].map((t) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5 text-sm text-gray-700", children: [
        /* @__PURE__ */ jsx(CheckGlyph, { className: "mt-0.5 h-4 w-4 shrink-0 text-indigo-600" }),
        t
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8", children: /* @__PURE__ */ jsx(WaitlistForm, {}) })
  ] }) }) });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-gray-100 bg-gray-50 pb-28 pt-12 sm:pb-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-xs text-center sm:text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 sm:justify-start", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white", children: /* @__PURE__ */ jsx(ChatGlyph, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold tracking-tight", children: "SalesAgent AI" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-gray-500", children: "The AI sales agent for small businesses — answers every visitor, 24/7." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-16 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: "Product" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-3 space-y-2 text-gray-500", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#features", className: "transition hover:text-gray-900", children: "What it does" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#industries", className: "transition hover:text-gray-900", children: "Industries" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#pricing", className: "transition hover:text-gray-900", children: "Pricing" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: "Company" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-3 space-y-2 text-gray-500", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#demo", className: "transition hover:text-gray-900", children: "Live demo" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#waitlist", className: "transition hover:text-gray-900", children: "Join the waitlist" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-400 sm:flex-row", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " SalesAgent AI. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Built with",
        " ",
        /* @__PURE__ */ jsx("a", { href: "https://cto.new", className: "underline transition hover:text-gray-600", children: "cto.new" })
      ] })
    ] })
  ] }) });
}
function IconBase({
  className,
  d
}) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: className ?? "h-5 w-5", children: /* @__PURE__ */ jsx("path", { d }) });
}
function ChatGlyph({
  className
}) {
  return /* @__PURE__ */ jsx(IconBase, { className, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" });
}
function ArrowGlyph({
  className
}) {
  return /* @__PURE__ */ jsx(IconBase, { className, d: "M17 8l4 4m0 0l-4 4m4-4H3" });
}
function CheckGlyph({
  className
}) {
  return /* @__PURE__ */ jsx(IconBase, { className, d: "M5 13l4 4L19 7" });
}
export {
  Home as component
};
