"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Msg = { role: "user" | "bot"; text: string };

export default function AskAi() {
  const [report, setReport] = useState<any>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* load stored report once */
  useEffect(() => {
    const raw = localStorage.getItem("aiReport");
    if (raw) setReport(JSON.parse(raw));
  }, []);

  /* auto-scroll */
  useEffect(
    () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    [msgs]
  );

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const user: Msg = { role: "user", text: input };
    setMsgs((m) => [...m, user]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: user.text, context: report }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        { role: "bot", text: res.ok ? data.answer : data.error },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Network error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">MyGage Support Bot</h1>
        <span />
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {msgs.length === 0 && (
          <>
            <BotBubble>Hey there! I'm Ur Personal Finance Bot</BotBubble>
            <BotBubble>
              I'm a GageBot. How can I help you today sweetheart?
            </BotBubble>

            {[
              "Explain more on my report",
              "What is my annual income",
              "Explain Flexible Tenure",
              "All Housing Loan in Malaysia",
              "Knowledgebase & FAQ to get a loan",
            ].map((q) => (
              <QuickBtn key={q} onClick={() => setInput(q)}>
                {q}
              </QuickBtn>
            ))}
          </>
        )}

        {msgs.map((m, i) =>
          m.role === "user" ? (
            <UserBubble key={i}>{m.text}</UserBubble>
          ) : (
            <BotBubble key={i}>{m.text}</BotBubble>
          )
        )}

        <div ref={bottomRef} />
      </div>

      {/* input bar */}
      <form
        onSubmit={send}
        className="flex gap-2 p-3 border-t bg-background sticky bottom-0"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message…"
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? "…" : "Send"}
        </Button>
      </form>
    </div>
  );
}

/* --- tiny atoms --- */
function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/40 px-4 py-2 max-w-[85%]">
      {children}
    </div>
  );
}
function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto rounded-lg bg-green-600/20 px-4 py-2 max-w-[85%]">
      {children}
    </div>
  );
}
function QuickBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block mt-2 w-fit border px-3 py-1 rounded hover:bg-muted/30 text-sm"
    >
      {children}
    </button>
  );
}
