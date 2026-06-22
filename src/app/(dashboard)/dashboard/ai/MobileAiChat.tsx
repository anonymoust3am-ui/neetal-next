'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  Clock3,
  History,
  Loader2,
  Paperclip,
  Plus,
  Send,
  Trash2,
  UserRound,
  X,
  CornerUpLeft,
  ThumbsUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  deleteAiHistory,
  getAiHistories,
  getAiHistory,
  mapApiMessages,
  sendAiMessage,
  type AiHistoryListItem,
  type AiUiMessage,
} from './aiApi';

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createWelcomeMessage(): AiUiMessage {
  return {
    id: createId(),
    role: 'ai',
    text: "Hi, I'm Neetell AI. Ask me about your rank, category, quota, state, choice filling, or counselling steps.",
    time: nowLabel(),
  };
}

function MessageMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="ml-4 list-disc space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1">{children}</ol>,
        strong: ({ children }) => <strong className="font-black text-foreground">{children}</strong>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export function MobileAiChat() {
  const { user, firebaseUser } = useAuth();
  const [mobileActive, setMobileActive] = useState(false);
  const [threads, setThreads] = useState<AiHistoryListItem[]>([]);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [messages, setMessages] = useState<AiUiMessage[]>([createWelcomeMessage()]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<AiUiMessage | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userName = useMemo(() => {
    return user?.name?.split(' ')[0] || user?.phone || 'You';
  }, [user]);
  const creditUsed = remainingCredits ?? user?.aiCredits ?? 0;
  const creditLimit = user?.aiCreditLimit ?? 0;
  const aiEnabled = user?.isAiEnabled === true;

  useEffect(() => {
    setRemainingCredits(user?.aiCredits ?? null);
  }, [user?.aiCredits]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setMobileActive(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!firebaseUser || !mobileActive) return;

    let cancelled = false;

    async function loadInitialHistory() {
      setHistoryLoading(true);
      setErrorMessage('');
      try {
        const token = await firebaseUser.getIdToken();
        const list = await getAiHistories(token);
        if (cancelled) return;

        setThreads(list);
        const first = list[0];
        if (!first) {
          setActiveThreadId('');
          setMessages([createWelcomeMessage()]);
          return;
        }

        setActiveThreadId(first.id);
        const detail = await getAiHistory(token, first.id);
        if (!cancelled) setMessages(mapApiMessages(detail.messages));
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load AI chat history.');
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    loadInitialHistory();
    return () => {
      cancelled = true;
    };
  }, [firebaseUser, mobileActive]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.style.height = '40px';
    inputNode.style.height = `${Math.min(inputNode.scrollHeight, 96)}px`;
    inputNode.style.overflowY = inputNode.scrollHeight > 96 ? 'auto' : 'hidden';
  }, [input]);

  const startNewChat = () => {
    setActiveThreadId('');
    setMessages([createWelcomeMessage()]);
    setReplyTo(null);
    setInput('');
    setAttachedFile(null);
    setErrorMessage('');
    setHistoryOpen(false);
  };

  const refreshThreads = async (preferredId?: string) => {
    if (!firebaseUser || !mobileActive) return;
    const token = await firebaseUser.getIdToken();
    const list = await getAiHistories(token);
    setThreads(list);
    if (preferredId) setActiveThreadId(preferredId);
  };

  const openThread = async (thread: AiHistoryListItem) => {
    if (!firebaseUser || !mobileActive || historyLoading) return;
    setHistoryLoading(true);
    setErrorMessage('');
    try {
      const token = await firebaseUser.getIdToken();
      const detail = await getAiHistory(token, thread.id);
      setActiveThreadId(detail.id);
      setMessages(mapApiMessages(detail.messages));
      setReplyTo(null);
      setHistoryOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to open this chat.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteThread = async (threadId: string) => {
    if (!firebaseUser || !mobileActive || historyLoading) return;
    setHistoryLoading(true);
    setErrorMessage('');
    try {
      const token = await firebaseUser.getIdToken();
      await deleteAiHistory(token, threadId);
      const next = threads.filter(thread => thread.id !== threadId);
      setThreads(next);

      if (threadId === activeThreadId) {
        const fallback = next[0];
        if (fallback) {
          const detail = await getAiHistory(token, fallback.id);
          setActiveThreadId(detail.id);
          setMessages(mapApiMessages(detail.messages));
        } else {
          startNewChat();
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete this chat.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || !firebaseUser || !mobileActive) return;
    if (!aiEnabled) {
      setErrorMessage('Neetell AI is not enabled for your account. Please contact support or enable AI access before sending a message.');
      return;
    }

    const replyPrefix = replyTo ? `Replying to ${replyTo.role === 'user' ? userName : 'Neetell AI'}: "${replyTo.text}"\n\n` : '';
    const fileLine = attachedFile ? `\n\nAttached file noted: ${attachedFile}` : '';
    const outgoing: AiUiMessage = {
      id: createId(),
      role: 'user',
      text,
      time: nowLabel(),
      replyTo: replyTo ? { role: replyTo.role, text: replyTo.text } : undefined,
      attachment: attachedFile ?? undefined,
    };

    setMessages(current => [...current, outgoing]);
    setInput('');
    setReplyTo(null);
    setAttachedFile(null);
    setLoading(true);
    setErrorMessage('');

    try {
      const token = await firebaseUser.getIdToken();
      const data = await sendAiMessage(token, {
        message: `${replyPrefix}${text}${fileLine}`,
        chatHistoryId: activeThreadId || undefined,
      });
      if (typeof data.aiCredits === 'number') {
        setRemainingCredits(data.aiCredits);
      }

      setMessages(current => [
        ...current,
        {
          id: createId(),
          role: 'ai',
          text: data.answer || 'I checked the predictor, but no explanation was returned.',
          time: nowLabel(),
        },
      ]);
      if (data.chatHistoryId) {
        setActiveThreadId(data.chatHistoryId);
        await refreshThreads(data.chatHistoryId);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while connecting to the predictor API.';
      setErrorMessage(message);
      setMessages(current => [
        ...current,
        {
          id: createId(),
          role: 'ai',
          text: message,
          time: nowLabel(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-[10] bg-background text-foreground">
      <header className="fixed inset-x-0 top-16 z-[50] h-12 border-b border-border bg-surface/98 backdrop-blur">
        <div className="relative mx-auto flex h-full max-w-md items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground-muted"
            aria-label="Open chat history"
          >
            <History size={16} />
          </button>
          <div className="text-center">
            <h1 className="text-[20px] font-black leading-tight text-foreground">Neetell AI</h1>
            <p className="text-[10px] font-bold text-primary">{creditUsed}/{creditLimit} credits</p>
          </div>
        </div>
      </header>

      <main className="absolute inset-x-0 top-12 bottom-[140px] overflow-hidden">
        <div className="no-scrollbar mx-auto h-full max-w-md space-y-3.5 overflow-y-auto overscroll-contain px-3.5 pb-4 pt-3.5">
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              userName={userName}
              onReply={() => setReplyTo(message)}
            />
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
                <Bot size={15} />
              </div>
              <div className="rounded-xl rounded-bl-sm border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground-muted">
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin" />
                  Neetell AI is thinking...
                </span>
              </div>
            </div>
          )}
          {errorMessage && !loading && (
            <div className="rounded-xl border border-error/25 bg-error-light px-3 py-2 text-xs font-semibold text-error">
              {errorMessage}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-surface/98 px-3 pb-[82px] pt-2.5 backdrop-blur">
        <div className="mx-auto max-w-md">
          {replyTo && (
            <div className="mb-1.5 flex items-start gap-2 rounded-lg border border-primary/25 bg-primary-light px-2.5 py-1.5">
              <CornerUpLeft size={12} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-wider text-primary">Replying</p>
                <p className="truncate text-[11px] font-semibold text-foreground">{replyTo.text}</p>
              </div>
              <button type="button" onClick={() => setReplyTo(null)} className="text-primary">
                <X size={12} />
              </button>
            </div>
          )}

          {attachedFile && (
            <div className="mb-1.5 flex items-center justify-between rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-foreground-muted">
              <span className="truncate">Attached: {attachedFile}</span>
              <button type="button" onClick={() => setAttachedFile(null)} className="text-foreground-subtle">
                <X size={12} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-[36px_1fr_40px] items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground-muted"
              aria-label="Attach file"
            >
              <Paperclip size={15} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              placeholder="Ask about rank, college, quota..."
              className="no-scrollbar max-h-24 min-h-10 resize-none rounded-lg border border-border bg-input px-3 py-2.5 text-[13px] font-medium text-foreground outline-none placeholder:text-foreground-subtle focus:border-border-focus"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim() || !firebaseUser || !mobileActive}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm disabled:bg-disabled disabled:text-foreground-subtle"
              aria-label="Send message"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={event => setAttachedFile(event.target.files?.[0]?.name ?? null)}
          />
        </div>
      </footer>

      {historyOpen && (
        <div className="fixed inset-0 z-[1400] bg-overlay">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Close history" onClick={() => setHistoryOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[84vw] max-w-[340px] flex-col border-r border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-primary">History</p>
                <h2 className="text-sm font-black text-foreground">Chats</h2>
              </div>
              <button type="button" onClick={() => setHistoryOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full border border-border">
                <X size={13} />
              </button>
            </div>

            <div className="border-b border-border p-2.5">
              <button
                type="button"
                onClick={startNewChat}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary text-s font-black text-primary-foreground"
              >
                <Plus size={14} />
                New chat
              </button>
              <div className="mt-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
                <p className="text-[9px] font-black uppercase tracking-wider text-foreground-subtle">Credit remaining</p>
                <p className="mt-0.5 text-xs font-black text-foreground">{creditUsed}/{creditLimit}</p>
              </div>
            </div>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
              {historyLoading && threads.length === 0 && (
                <div className="rounded-lg border border-border bg-card p-3 text-xs font-semibold text-foreground-muted">
                  Loading chats...
                </div>
              )}
              {!historyLoading && threads.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-card p-3 text-xs font-semibold text-foreground-muted">
                  No saved chats yet.
                </div>
              )}
              {threads.map(thread => (
                <div
                  key={thread.id}
                  className={`mb-1.5 grid grid-cols-[1fr_30px] items-center gap-1.5 rounded-lg border px-2 py-1.5 ${
                    thread.id === activeThreadId ? 'border-primary/40 bg-primary-light' : 'border-border bg-card'
                  }`}
                >
                  <button type="button" onClick={() => openThread(thread)} className="min-w-0 text-left">
                    <p className="truncate text-[11px] font-bold text-foreground">{thread.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold text-foreground-subtle">
                      <Clock3 size={10} />
                      {new Date(thread.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteThread(thread.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-subtle hover:bg-error-light hover:text-error"
                    aria-label="Delete chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  userName,
  onReply,
}: {
  message: AiUiMessage;
  userName: string;
  onReply: () => void;
}) {
  const isUser = message.role === 'user';
  const label = isUser ? userName : 'Neetell AI';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
          <Bot size={15} />
        </div>
      )}

      <div className={`max-w-[84%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${isUser ? 'text-primary' : 'text-secondary'}`}>
          <span>{label}</span>
          <span className="font-semibold normal-case tracking-normal text-foreground-subtle">{message.time}</span>
        </div>

        <div
          className={`rounded-xl px-3.5 py-2.5 text-s leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-br-sm bg-primary text-primary-foreground'
              : 'rounded-bl-sm border border-border bg-card text-foreground'
          }`}
        >
          {message.replyTo && (
            <div className={`mb-1.5 rounded-lg px-2.5 py-1.5 text-s ${isUser ? 'bg-white/15 text-white/85' : 'bg-muted text-foreground-muted'}`}>
              <p className="font-black">{message.replyTo.role === 'user' ? userName : 'Neetell AI'}</p>
              <p className="mt-0.5 line-clamp-2">{message.replyTo.text}</p>
            </div>
          )}
          {isUser ? <p>{message.text}</p> : <MessageMarkdown text={message.text} />}
          {message.attachment && (
            <div className={`mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold ${isUser ? 'bg-white/15 text-white/90' : 'bg-muted text-foreground-muted'}`}>
              <Paperclip size={13} className="shrink-0" />
              <span className="truncate">{message.attachment}</span>
            </div>
          )}
        </div>

        {!isUser && (
          <div className="mt-1 flex items-center gap-1">
            <button
              type="button"
              onClick={onReply}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-foreground-subtle hover:bg-muted hover:text-primary"
            >
              <CornerUpLeft size={12} />
              Follow
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-foreground-subtle hover:bg-muted hover:text-success"
            >
              <ThumbsUp size={12} />
              Like
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
          <UserRound size={15} />
        </div>
      )}
    </div>
  );
}
