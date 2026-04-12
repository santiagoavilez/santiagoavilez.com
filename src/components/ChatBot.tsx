import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What's Santiago's tech stack?",
  "Tell me about Fulbbo",
  "What's his work experience?",
  "Is he open to remote roles?",
];

const FALLBACK_ERROR = "AI is temporarily unavailable, please try again later";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70" />
    </div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
    }
  }, [hasOpenedOnce, isOpen]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (rawMessage?: string) => {
    const content = (rawMessage ?? input).trim();
    if (!content || isLoading) {
      return;
    }

    const nextUserMessage: ChatMessage = { role: "user", content };
    const nextMessages = [...messages, nextUserMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json().catch(() => null);
      const reply = typeof data?.reply === "string" ? data.reply.trim() : "";
      const errorMessage =
        typeof data?.error === "string" ? data.error : FALLBACK_ERROR;

      if (!response.ok || !reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errorMessage },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: FALLBACK_ERROR },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-primary shadow-[var(--shadow-md)] transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="h-6 w-6" />
        {!hasOpenedOnce && (
          <span className="absolute -left-[4.6rem] inline-flex animate-pulse items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground shadow-[var(--shadow-sm)] backdrop-blur-sm">
            Ask AI
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-[65] transition-all duration-200 ease-out sm:inset-auto sm:bottom-24 sm:right-5 ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-[0.98] opacity-0 sm:translate-y-2"
        }`}
      >
        <div className="flex h-[100dvh] w-full flex-col border border-border bg-card text-card-foreground shadow-[var(--shadow-lg)] backdrop-blur-sm sm:h-[580px] sm:w-[380px] sm:rounded-lg">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Chat with Santiago&apos;s AI
              </p>
              <p className="text-xs text-muted-foreground">
                Ask about projects, skills, and experience
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Close chat panel"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask me anything about Santiago&apos;s experience, projects, or tech stack.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void sendMessage(question)}
                      className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border border-border bg-muted/70 text-card-foreground"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-border bg-muted/70">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={endOfMessagesRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-border px-3 py-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-input bg-background/70 px-3 py-2 transition focus-within:ring-2 focus-within:ring-ring">
              <input
                type="text"
                value={input}
                disabled={isLoading}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Santiago..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
