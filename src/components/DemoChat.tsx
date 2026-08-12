import { useEffect, useRef, useState } from "react";

/**
 * DemoChat — a self-contained, scripted demo of the SalesAgent AI widget.
 *
 * Fully client-side: canned responses, no network calls, no backend. It plays a
 * scripted conversation (fictional "Oceanview Grand Hotel") that shows the core
 * product behaviors: answering a visitor, capturing a lead (name + email),
 * booking, and recommending an upgrade. A visible "Demo" badge and footer note
 * make clear this is simulated, not a live AI.
 */

type Role = "agent" | "user" | "system";

interface Message {
  id: number;
  role: Role;
  text: string;
}

interface QuickReply {
  label: string;
  next: NodeId;
}

type NodeId =
  | "greeting"
  | "fallback"
  | "availability"
  | "book-start"
  | "other-options"
  | "payment"
  | "faq"
  | "faq-checkout"
  | "faq-parking"
  | "capture-name"
  | "capture-email"
  | "confirm"
  | "upgrade-added"
  | "booked-final"
  | "thanks"
  | "restart";

interface ChatNode {
  text: string;
  replies?: QuickReply[];
}

const NODES: Record<NodeId, ChatNode> = {
  greeting: {
    text: "Hi there! 👋 I'm Ava, the AI sales agent for Oceanview Grand Hotel. I can check room availability, take a booking, and answer questions — 24/7. How can I help?",
    replies: [
      { label: "Check availability", next: "availability" },
      { label: "Book a room", next: "book-start" },
      { label: "Ask a question", next: "faq" },
    ],
  },
  fallback: {
    text: "I'm a scripted demo, so I can only follow the options below — but that's exactly how a real SalesAgent AI keeps the conversation moving. Tap a suggestion to continue!",
    replies: [
      { label: "Check availability", next: "availability" },
      { label: "Book a room", next: "book-start" },
      { label: "Ask a question", next: "faq" },
    ],
  },
  availability: {
    text: "Great news — the Deluxe Sea-View Room is available for your dates: $189/night, breakfast included. Would you like me to reserve it for you?",
    replies: [
      { label: "Yes, book it", next: "capture-name" },
      { label: "Show me other options", next: "other-options" },
      { label: "Payment & cancellation", next: "payment" },
    ],
  },
  "book-start": {
    text: "Happy to help! Let me check availability first — good news, the Deluxe Sea-View Room is open for your dates at $189/night, breakfast included. Shall I reserve it?",
    replies: [
      { label: "Yes, book it", next: "capture-name" },
      { label: "Show me other options", next: "other-options" },
    ],
  },
  "other-options": {
    text: "We also have the Garden Twin at $149/night and the Oceanview Suite at $289/night. Which would you like?",
    replies: [
      { label: "Book the Garden Twin", next: "capture-name" },
      { label: "Book the Oceanview Suite", next: "capture-name" },
      { label: "Stick with the Deluxe", next: "capture-name" },
    ],
  },
  payment: {
    text: "All payments are handled securely at checkout — we take every major card, and you can cancel free of charge up to 48 hours before arrival. Shall I reserve the Deluxe room for you?",
    replies: [
      { label: "Yes, reserve it", next: "capture-name" },
      { label: "Show me other options", next: "other-options" },
    ],
  },
  faq: {
    text: "Ask away — I know our rooms, amenities, and policies inside out. What would you like to know?",
    replies: [
      { label: "What time is checkout?", next: "faq-checkout" },
      { label: "Is parking available?", next: "faq-parking" },
      { label: "Just book a room", next: "book-start" },
    ],
  },
  "faq-checkout": {
    text: "Checkout is at 11:00am — and we offer late checkout until 2pm for a small fee. Anything else I can help with?",
    replies: [
      { label: "Is parking available?", next: "faq-parking" },
      { label: "Book a room", next: "book-start" },
      { label: "That's all, thanks", next: "thanks" },
    ],
  },
  "faq-parking": {
    text: "Yes — free on-site parking for all guests, no reservation needed. Anything else?",
    replies: [
      { label: "What time is checkout?", next: "faq-checkout" },
      { label: "Book a room", next: "book-start" },
      { label: "That's all, thanks", next: "thanks" },
    ],
  },
  "capture-name": {
    text: "Wonderful choice! 🎉 Just a couple of quick details so I can secure the reservation — what name should I put it under?",
  },
  "capture-email": {
    text: "Thanks, {name}! And what email should I attach to the reservation?",
  },
  confirm: {
    text: "Perfect — you're all set, {name}! I've reserved the Deluxe Sea-View Room for 2 nights and attached your details ({email}) to the reservation. One more thing: our guests love the breakfast upgrade (+$15/night). Want me to add it?",
    replies: [
      { label: "Yes, add breakfast", next: "upgrade-added" },
      { label: "No, thanks", next: "booked-final" },
    ],
  },
  "upgrade-added": {
    text: "Done! 🥐 Breakfast is added to your stay. Here's your reservation: 2 nights in the Deluxe Sea-View Room with breakfast, confirmed under {name}. Anything else I can help with?",
    replies: [
      { label: "That's all, thanks", next: "thanks" },
      { label: "Restart demo", next: "restart" },
    ],
  },
  "booked-final": {
    text: "No problem! Your reservation is confirmed under {name}: 2 nights in the Deluxe Sea-View Room. Anything else I can help with?",
    replies: [
      { label: "That's all, thanks", next: "thanks" },
      { label: "Restart demo", next: "restart" },
    ],
  },
  thanks: {
    text: "It was a pleasure helping you, {name}! 👋 I'm here 24/7 whenever you need me. A real SalesAgent AI would also follow up automatically — a reminder before you arrive, then a review request after checkout. Want to start over?",
    replies: [{ label: "Restart demo", next: "restart" }],
  },
  restart: { text: "" },
};

interface DemoChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoChat({ open, onOpenChange }: DemoChatProps) {
  const [booted, setBooted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNode, setCurrentNode] = useState<NodeId>("greeting");
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState({ name: "", email: "" });

  const timersRef = useRef<number[]>([]);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(open);

  function schedule(fn: () => void, ms: number) {
    const t = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((x) => x !== t);
      // No-op if the panel has been closed: never advance conversation state
      // invisibly while hidden (otherwise a message would appear on reopen).
      if (!openRef.current) return;
      fn();
    }, ms);
    timersRef.current.push(t);
  }

  function pushMessage(role: Role, text: string) {
    idRef.current += 1;
    setMessages((prev) => [...prev, { id: idRef.current, role, text }]);
  }

  function say(nodeId: NodeId, overrides?: { name?: string; email?: string }) {
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

  // When the panel is first opened, have the agent "type" its greeting.
  // Also re-greet if the panel was closed before that first greeting landed
  // (messages still empty) so reopening never shows a bare, silent chat.
  useEffect(() => {
    if (open && !booted) {
      setBooted(true);
      greet();
    } else if (open && booted && messages.length === 0 && !typing) {
      greet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booted, messages.length, typing]);

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  // Cancel pending timers when the panel closes so the scripted conversation
  // can't advance invisibly while hidden; reset the typing flag so the next
  // open resumes from a clean, responsive state.
  useEffect(() => {
    if (!open) {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
      setTyping(false);
    }
  }, [open]);

  // Track the panel state so scheduled callbacks can no-op when closed.
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Clear pending timers on unmount.
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  function goTo(next: NodeId, userText: string) {
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

  function handleReply(reply: QuickReply) {
    goTo(reply.next, reply.label);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput("");

    // Lead capture step 1: name.
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

    // Lead capture step 2: email.
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
      // Show the product behavior: the conversation just became a lead.
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

    // Free text anywhere else → scripted fallback.
    goTo("fallback", text);
  }

  const node = NODES[currentNode];
  const showChips = !typing && !!node.replies && node.replies.length > 0;
  const placeholder =
    currentNode === "capture-name"
      ? "Type your name…"
      : currentNode === "capture-email"
        ? "Type your email…"
        : "Type a message…";

  return (
    <>
      {/* Floating launcher button */}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={open ? "Close demo chat" : "Open demo chat"}
        className={
          open
            ? "fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500 sm:bottom-5 sm:right-6"
            : "pulse-ring fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:scale-105 hover:bg-indigo-500 sm:bottom-5 sm:right-6"
        }
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="SalesAgent AI demo chat"
          className="chat-pop fixed bottom-20 left-1/2 z-50 flex h-[min(68dvh,560px)] w-[min(400px,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:bottom-24 sm:left-auto sm:right-6 sm:translate-x-0"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-indigo-600 px-4 py-3 text-white">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <ChatIcon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">SalesAgent AI</p>
                <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Demo
                </span>
              </div>
              <p className="truncate text-xs text-indigo-100">
                Ava · Oceanview Grand Hotel · Online
              </p>
            </div>
            <button
              type="button"
              onClick={resetChat}
              title="Restart demo"
              aria-label="Restart demo"
              className="rounded-full p-1.5 transition hover:bg-white/15"
            >
              <ResetIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              title="Close chat"
              aria-label="Close chat"
              className="rounded-full p-1.5 transition hover:bg-white/15"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4"
          >
            {messages.map((m) => {
              if (m.role === "system") {
                return (
                  <div key={m.id} className="msg-in flex justify-center">
                    <span className="rounded-full bg-gray-200/90 px-3 py-1 text-center text-[11px] font-medium text-gray-600">
                      {m.text}
                    </span>
                  </div>
                );
              }
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={
                    "msg-in flex " + (isUser ? "justify-end" : "justify-start")
                  }
                >
                  <div
                    className={
                      isUser
                        ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm"
                        : "max-w-[85%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="msg-in flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {showChips && node.replies && (
            <div className="flex flex-wrap gap-2 bg-white px-4 pb-2 pt-1">
              {node.replies.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => handleReply(r)}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={typing}
              aria-label="Type a message"
              className="h-10 min-w-0 flex-1 rounded-full border border-gray-300 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>

          <p className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center text-[11px] text-gray-400">
            Demo — scripted responses from a fictional hotel, not a live AI. No
            data is sent or stored.
          </p>
        </div>
      )}
    </>
  );
}

/* --- Inline icons (stroke style, sized via className) ------------------ */

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

function ChatIcon({ className }: { className?: string }) {
  return (
    <IconBase
      className={className}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  );
}

function CloseIcon({ className }: { className?: string }) {
  return <IconBase className={className} d="M6 18L18 6M6 6l12 12" />;
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <IconBase
      className={className}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  );
}
