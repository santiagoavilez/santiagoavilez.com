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
      <span className="h-2 w-2 animate-bounce rounded-full bg-cerulean-300 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-cerulean-300 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-cerulean-300" />
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
        className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-cerulean-500/60 bg-gray-900/95 text-cerulean-200 shadow-lg shadow-black/30 transition hover:scale-105 hover:text-cerulean-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cerulean-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="h-6 w-6" />
        {!hasOpenedOnce && (
          <span className="absolute -left-[4.6rem] inline-flex animate-pulse items-center rounded-full border border-cerulean-400/60 bg-cerulean-500/20 px-3 py-1 text-xs font-semibold text-cerulean-100 backdrop-blur-sm">
            Ask AI
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-[65] transition duration-200 sm:inset-auto sm:bottom-24 sm:right-5 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0 sm:translate-y-2 sm:scale-[0.98]"
        }`}
      >
        <div className="flex h-[100dvh] w-full flex-col border border-white/10 bg-gray-900/95 shadow-2xl shadow-black/40 backdrop-blur-sm sm:h-[580px] sm:w-[380px] sm:rounded-2xl">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-100">
                Chat with Santiago&apos;s AI
              </p>
              <p className="text-xs text-gray-400">Ask about projects, skills, and experience</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cerulean-400"
              aria-label="Close chat panel"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Ask me anything about Santiago&apos;s experience, projects, or tech stack.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void sendMessage(question)}
                      className="rounded-full border border-cerulean-400/40 bg-cerulean-500/10 px-3 py-1.5 text-xs font-medium text-cerulean-100 transition hover:bg-cerulean-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                        ? "rounded-br-md bg-cerulean-600 text-white"
                        : "rounded-bl-md border border-white/10 bg-white/5 text-gray-100"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={endOfMessagesRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 px-3 py-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2">
              <input
                type="text"
                value={input}
                disabled={isLoading}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Santiago..."
                className="w-full bg-transparent text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cerulean-600 text-white transition hover:bg-cerulean-500 disabled:cursor-not-allowed disabled:opacity-50"
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
