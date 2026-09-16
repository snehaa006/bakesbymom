import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchCatalog, type CategoryWithCakes } from "../lib/catalog";
import { isApiConfigured, resolvePhotoUrl } from "../lib/api";
import { formatPrice } from "../lib/format";
import { answer, STARTER_CHIPS, type BotReply, type CakeHit } from "../lib/chat";

interface Message {
  id: number;
  from: "bot" | "you";
  text: string[];
  cakes?: CakeHit[];
  chips?: string[];
}

const GREETING: Message = {
  id: 0,
  from: "bot",
  text: [
    "Hello! I'm Mom's little helper.",
    "Ask me about sizes, flavours, budgets or what to get for an occasion — or tap one of these:",
  ],
  chips: STARTER_CHIPS,
};

/**
 * The floating cake assistant. It loads the catalog once, the first time it is
 * opened, then answers out of that snapshot — so typing is instant and the site
 * doesn't pay for an API call it may never need.
 */
export function ChatBot() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [catalog, setCatalog] = useState<CategoryWithCakes[]>([]);
  const [loaded, setLoaded] = useState(false);

  const nextId = useRef(1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || loaded || !isApiConfigured) return;
    fetchCatalog()
      .then(setCatalog)
      .catch(() => setCatalog([]))
      .finally(() => setLoaded(true));
  }, [open, loaded]);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel, the way every other overlay on the web does.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const reply: BotReply = answer(trimmed, catalog);
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, from: "you", text: [trimmed] },
      { id: nextId.current++, from: "bot", ...reply },
    ]);
    setDraft("");
  }

  // The admin panel is a back office, not a shop front — no assistant there.
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <button
        type="button"
        className={`chat-launch ${open ? "chat-launch--open" : ""}`.trim()}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close the cake assistant" : "Ask about our cakes"}
      >
        {open ? "×" : "Ask about cakes"}
      </button>

      <div
        id="chat-panel"
        className={`chat ${open ? "chat--open" : ""}`.trim()}
        role="dialog"
        aria-label="Cake assistant"
        aria-hidden={!open}
      >
        <header className="chat__head">
          <div>
            <p className="chat__title">Cake assistant</p>
            <p className="chat__sub">Sizes · flavours · prices · what to gift</p>
          </div>
          <button type="button" className="chat__close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </header>

        <div className="chat__scroll" ref={scrollerRef}>
          {messages.map((message) => (
            <div key={message.id} className={`chat__msg chat__msg--${message.from}`}>
              <div className="chat__bubble">
                {message.text.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              {message.cakes && message.cakes.length > 0 && (
                <div className="chat__cakes">
                  {message.cakes.map((cake) => (
                    <Link
                      key={cake.id}
                      to={`/catalog/${cake.id}`}
                      className="chat__cake"
                      onClick={() => setOpen(false)}
                    >
                      <span className="chat__cake-photo">
                        {cake.photo ? (
                          <img src={resolvePhotoUrl(cake.photo)} alt="" loading="lazy" />
                        ) : null}
                      </span>
                      <span className="chat__cake-text">
                        <span className="chat__cake-name">{cake.name}</span>
                        <span className="chat__cake-meta">
                          {formatPrice(cake.price)} · {cake.weightKg} kg · {cake.category}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {message.chips && message.chips.length > 0 && (
                <div className="chat__chips">
                  {message.chips.map((chip) => (
                    <button key={chip} type="button" className="chat__chip" onClick={() => send(chip)}>
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          className="chat__form"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <input
            ref={inputRef}
            className="chat__input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about a cake…"
            aria-label="Ask about a cake"
          />
          <button type="submit" className="chat__send" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
