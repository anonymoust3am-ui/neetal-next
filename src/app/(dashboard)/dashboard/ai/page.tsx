'use client';

import { Bot, Plus, Send, Paperclip, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hi! I'm your NEET counselling assistant. Ask anything about colleges, cutoffs, or counselling.",
    },
  ]);

  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔥 Simulated AI response
  const fakeAIResponse = (userText: string) => {
    return `Based on "${userText}", I recommend exploring top AIQ colleges like MAMC, VMMC, and GMC Mumbai. Want a detailed comparison?`;
  };

  const handleSend = () => {
    if (!input.trim() && files.length === 0) return;

    const fileNames = files.map(f => f.name).join(', ');

    const userMessage = {
      role: 'user' as const,
      text: files.length
        ? `${input} 📎 [${fileNames}]`
        : input,
    };

    setMessages(prev => [...prev, userMessage]);

    setInput('');
    setFiles([]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: `Got your message${files.length ? ' with files' : ''}. Let me analyze that.`,
        },
      ]);
    }, 700);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-background">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-65 bg-sidebar border-r border-border flex flex-col">

        <div className="p-4 border-b border-border flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-secondary-light text-secondary flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Assistant</p>
            <p className="text-xs text-foreground-subtle">NEET Counselling</p>
          </div>
        </div>

        <div className="p-3">
          <button className="w-full flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition">
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
          {[
            'Rank 1200 colleges',
            'AIQ vs State quota which is better for me long long text example',
            'MCC Round 2 help',
            'Best colleges under 5000 rank in India with low fees',
          ].map((chat, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground-muted hover:bg-hover hover:text-foreground transition"
            >
              <span className="block truncate" title={chat}>
                {chat}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* ================= CHAT AREA ================= */}
      <main className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-30 py-15 space-y-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
            >
              {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-secondary-light text-secondary flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed shadow-sm ${m.role === 'ai'
                  ? 'bg-muted text-foreground rounded-tl-sm'
                  : 'bg-primary text-primary-foreground rounded-tr-sm'
                  }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* ================= INPUT ================= */}
        <div className="border-t border-border bg-surface px-4 py-3 sticky bottom-0">
          <div className="max-w-4xl mx-auto space-y-2">

            {/* File Preview Strip */}
            {files.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 min-w-[160px] max-w-[200px] bg-muted border border-border rounded-lg px-3 py-2"
                  >
                    {/* File Icon */}
                    <div className="w-8 h-8 rounded-md bg-secondary-light text-secondary flex items-center justify-center text-xs font-medium shrink-0">
                      📄
                    </div>

                    {/* File Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-foreground-subtle">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        setFiles(prev => prev.filter((_, i) => i !== index))
                      }
                      className="text-foreground-subtle hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="flex items-center gap-2">

              {/* Attach Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-hover transition"
              >
                <Paperclip size={16} />
              </button>

              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  setFiles(prev => [...prev, ...selected]);

                  // 🔥 important: reset input so same file can be selected again
                  e.target.value = '';
                }}
              />

              {/* Text Input */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about colleges, cutoffs..."
                className="flex-1 h-11 px-4 rounded-xl border border-border bg-input text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-border-focus"
              />

              {/* Send */}
              <button
                onClick={handleSend}
                className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-hover transition"
              >
                <Send size={16} className="text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}