'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Script from 'next/script';
import {
  Bot,
  Clock3,
  Loader2,
  MessageSquareReply,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  ThumbsUp,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MobileAiChat } from './MobileAiChat';
import {
  deleteAiHistory,
  getAiHistories,
  getAiHistory,
  mapApiMessages,
  sendAiMessage,
  type AiHistoryListItem,
  type AiUiMessage,
} from './aiApi';

const CREDIT_USED = 10;
const CREDIT_LIMIT = 50;

const starterPrompts = [
  'My rank is 85000, category OBC, state Bihar. Which colleges can I target?',
  'Rank 45000, EWS, All India, MBBS. Give safe and target options.',
  'My rank is 120000 SC Uttar Pradesh MBBS. Explain my chances.',
  'How should I order choices for AIQ Round 2?',
  'Explain safe, target, and dream colleges for my rank.',
];

function AiLottieIcon({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div className={`shrink-0 overflow-hidden rounded-full bg-transparent ${className}`}>
      {createElement('lottie-player', {
        src: '/neetell-ai.json',
        background: 'transparent',
        speed: '1',
        loop: true,
        autoplay: true,
        style: { width: '100%', height: '100%' },
      })}
    </div>
  );
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function timeLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function welcomeMessage(): AiUiMessage {
  return {
    id: createId(),
    role: 'ai',
    time: timeLabel(),
    text:
      "Hi! I'm your NEETal AI Counselling Assistant. Share your rank, category, state, and course. I will call the predictor database and explain the result in simple language.",
  };
}

function titleFromMessages(messages: AiUiMessage[], activeHistory?: AiHistoryListItem | null) {
  if (activeHistory?.title) return activeHistory.title;
  const firstUser = messages.find(message => message.role === 'user')?.text.trim();
  if (!firstUser) return 'New counselling chat';
  return firstUser.length > 54 ? `${firstUser.slice(0, 54)}...` : firstUser;
}

function MarkdownMessage({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="mb-3 mt-5 text-lg font-black text-foreground">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-2 mt-5 text-base font-black text-foreground">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-2 mt-4 text-sm font-bold text-foreground">{children}</h3>,
        p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1.5">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1.5">{children}</ol>,
        strong: ({ children }) => <strong className="font-black text-foreground">{children}</strong>,
        hr: () => <hr className="my-4 border-border" />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

function MessageRow({
  message,
  liked,
  onFollow,
  onLike,
}: {
  message: AiUiMessage;
  liked: boolean;
  onFollow: () => void;
  onLike: () => void;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary">
          <Bot size={17} />
        </div>
      )}

      <div className={`flex max-w-[780px] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${isUser ? 'text-primary' : 'text-secondary'}`}>
          <span>{isUser ? 'You' : 'Neetell AI'}</span>
          <span className="font-semibold normal-case tracking-normal text-foreground-subtle">{message.time}</span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-tr-sm bg-primary text-primary-foreground'
              : 'rounded-tl-sm border border-border bg-card text-foreground'
          }`}
        >
          {message.replyTo && (
            <div className={`mb-2 rounded-lg border-l-2 px-3 py-2 text-xs ${isUser ? 'border-white/55 bg-white/10 text-white/85' : 'border-primary/45 bg-primary-light text-foreground-muted'}`}>
              <span className="font-black">{message.replyTo.role === 'user' ? 'You' : 'Neetell AI'}: </span>
              <span className="line-clamp-2">{message.replyTo.text}</span>
            </div>
          )}
          {isUser ? <p>{message.text}</p> : <MarkdownMessage text={message.text} />}
          {message.attachment && (
            <div className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${isUser ? 'bg-white/15 text-white/90' : 'bg-muted text-foreground-muted'}`}>
              <Paperclip size={13} />
              <span className="truncate">{message.attachment}</span>
            </div>
          )}
        </div>

        {!isUser && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onFollow}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-black text-foreground-muted transition-colors hover:border-primary/35 hover:bg-primary-light hover:text-primary"
            >
              <MessageSquareReply size={13} />
              Follow
            </button>
            <button
              type="button"
              onClick={onLike}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-black transition-colors ${
                liked
                  ? 'border-primary/35 bg-primary-light text-primary'
                  : 'border-border bg-card text-foreground-muted hover:border-primary/35 hover:bg-primary-light hover:text-primary'
              }`}
            >
              <ThumbsUp size={13} />
              Like
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
          <UserRound size={17} />
        </div>
      )}
    </div>
  );
}

export default function AIPage() {
  const { firebaseUser } = useAuth();
  const [desktopActive, setDesktopActive] = useState(false);
  const [histories, setHistories] = useState<AiHistoryListItem[]>([]);
  const [activeChatHistoryId, setActiveChatHistoryId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiUiMessage[]>([welcomeMessage()]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<AiUiMessage | null>(null);
  const [likedMessages, setLikedMessages] = useState<Record<string, boolean>>({});
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const hasUserMessages = messages.some(message => message.role === 'user');
  const activeHistory = histories.find(history => history.id === activeChatHistoryId) ?? null;
  const chatTitle = titleFromMessages(messages, activeHistory);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktopActive(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const node = inputRef.current;
    if (!node) return;
    node.style.height = '42px';
    node.style.height = `${Math.min(node.scrollHeight, 112)}px`;
    node.style.overflowY = node.scrollHeight > 112 ? 'auto' : 'hidden';
  }, [input]);

  useEffect(() => {
    if (!firebaseUser || !desktopActive) return;

    let cancelled = false;

    async function loadInitialHistory() {
      setHistoryLoading(true);
      setErrorMessage('');
      try {
        const token = await firebaseUser?.getIdToken();
        const list = await getAiHistories(token?token:'');
        if (cancelled) return;

        setHistories(list);
        const first = list[0];
        if (!first) {
          setActiveChatHistoryId(null);
          setMessages([welcomeMessage()]);
          return;
        }

        setActiveChatHistoryId(first.id);
        const detail = await getAiHistory(token? token:'', first.id);
        if (!cancelled) {
          setMessages(mapApiMessages(detail.messages));
        }
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
  }, [desktopActive, firebaseUser]);

  const refreshHistories = async (preferredId?: string) => {
    if (!firebaseUser || !desktopActive) return;
    const token = await firebaseUser.getIdToken();
    const list = await getAiHistories(token);
    setHistories(list);
    if (preferredId) setActiveChatHistoryId(preferredId);
  };

  const startNewChat = () => {
    setMessages([welcomeMessage()]);
    setActiveChatHistoryId(null);
    setInput('');
    setAttachedFile(null);
    setReplyTo(null);
    setLikedMessages({});
    setErrorMessage('');
  };

  const openHistory = async (historyId: string) => {
    if (!firebaseUser || !desktopActive || historyLoading) return;
    setHistoryLoading(true);
    setErrorMessage('');
    try {
      const token = await firebaseUser.getIdToken();
      const detail = await getAiHistory(token, historyId);
      setActiveChatHistoryId(detail.id);
      setMessages(mapApiMessages(detail.messages));
      setReplyTo(null);
      setAttachedFile(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to open this chat.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const removeHistory = async (historyId: string) => {
    if (!firebaseUser || !desktopActive || historyLoading) return;
    setHistoryLoading(true);
    setErrorMessage('');
    try {
      const token = await firebaseUser.getIdToken();
      await deleteAiHistory(token, historyId);
      const next = histories.filter(history => history.id !== historyId);
      setHistories(next);

      if (historyId === activeChatHistoryId) {
        const fallback = next[0];
        if (fallback) {
          const detail = await getAiHistory(token, fallback.id);
          setActiveChatHistoryId(detail.id);
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

  const sendMessage = async (textFromPrompt?: string) => {
    const text = (textFromPrompt ?? input).trim();
    if (!text || loading || !firebaseUser || !desktopActive) return;

    const outgoing: AiUiMessage = {
      id: createId(),
      role: 'user',
      text,
      time: timeLabel(),
      attachment: attachedFile ?? undefined,
      replyTo: replyTo ? { role: replyTo.role, text: replyTo.text } : undefined,
    };
    const replyPrefix = replyTo ? `Replying to ${replyTo.role === 'user' ? 'You' : 'Neetell AI'}: "${replyTo.text}"\n\n` : '';

    setMessages(prev => [...prev, outgoing]);
    setInput('');
    setAttachedFile(null);
    setReplyTo(null);
    setLoading(true);
    setErrorMessage('');

    try {
      const token = await firebaseUser.getIdToken();
      const data = await sendAiMessage(token, {
        message: `${replyPrefix}${text}${attachedFile ? `\n\nAttached file noted: ${attachedFile}` : ''}`,
        chatHistoryId: activeChatHistoryId ?? undefined,
      });

      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          role: 'ai',
          text: data.answer || 'I checked the predictor, but no explanation was returned.',
          time: timeLabel(),
        },
      ]);
      if (data.chatHistoryId) {
        setActiveChatHistoryId(data.chatHistoryId);
        await refreshHistories(data.chatHistoryId);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while connecting to the predictor API.';
      setErrorMessage(message);
      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          role: 'ai',
          text: message,
          time: timeLabel(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@2.0.12/dist/lottie-player.js"
        strategy="afterInteractive"
      />
      <MobileAiChat />

      <div className="hidden overflow-hidden bg-background text-foreground lg:fixed lg:inset-x-0 lg:bottom-0 lg:top-[60px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-r border-border bg-sidebar">
          <div className="border-b border-border px-4 py-4">
            <div className="flex items-center gap-3">
              <AiLottieIcon className="h-20 w-20" />
              <div className="min-w-0">
                <p className="text-sm font-black text-foreground">Neetell AI</p>
                <p className="mt-1 text-xs text-foreground-muted">Your counselling assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={startNewChat}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-primary-foreground hover:bg-primary-hover"
            >
              <Plus size={15} />
              New chat
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-widest text-foreground-subtle">Recent chats</p>
            {historyLoading && histories.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-3 text-xs font-semibold text-foreground-muted">
                Loading chats...
              </div>
            )}
            {!historyLoading && histories.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card p-3 text-xs font-semibold text-foreground-muted">
                No saved chats yet.
              </div>
            )}
            {histories.map(history => (
              <div
                key={history.id}
                className={`mb-2 grid grid-cols-[1fr_32px] items-center gap-2 rounded-xl border p-2 ${
                  history.id === activeChatHistoryId ? 'border-primary/40 bg-primary-light' : 'border-border bg-card'
                }`}
              >
                <button type="button" onClick={() => openHistory(history.id)} className="min-w-0 text-left">
                  <p className="truncate text-xs font-bold text-foreground">{history.title || 'Untitled chat'}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-foreground-subtle">
                    <Clock3 size={11} />
                    {new Date(history.updatedAt).toLocaleDateString()}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => removeHistory(history.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-subtle hover:bg-error-light hover:text-error"
                  aria-label="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-warning/25 bg-warning-light/60 p-4 text-xs font-semibold leading-relaxed text-warning">
            AI responses may be incorrect. Please verify counselling dates, ranks, quotas, and official notices before making decisions.
          </div>
        </aside>

        <main className="flex min-h-0 flex-col bg-background">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-5">
            <div className="flex min-w-0 items-center gap-3">
              {/* <AiLottieIcon className="h-10 w-10" /> */}
              <div className="min-w-0">
                <h1 className="truncate text-sm font-black text-foreground">{chatTitle}</h1>
              </div>
            </div>
            <div className="shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-black text-foreground-subtle">
              {CREDIT_USED}/{CREDIT_LIMIT}
            </div>
          </header>

          <section className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-5">
              {!hasUserMessages ? (
                <div className="flex min-h-[calc(100vh-260px)] items-center justify-center">
                  <div className="w-full max-w-3xl text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                      <Sparkles size={24} />
                    </div>
                    <h2 className="mt-4 text-xl font-black text-foreground">Ask Neetell AI</h2>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-foreground-muted">
                      Start with your rank, category, quota, state, or choice filling doubt.
                    </p>
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      {starterPrompts.map(prompt => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-semibold leading-relaxed text-foreground-muted transition-colors hover:border-primary/40 hover:bg-primary-light hover:text-primary"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map(message => (
                  <MessageRow
                    key={message.id}
                    message={message}
                    liked={Boolean(likedMessages[message.id])}
                    onFollow={() => setReplyTo(message)}
                    onLike={() => setLikedMessages(current => ({ ...current, [message.id]: !current[message.id] }))}
                  />
                ))
              )}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary">
                    <Bot size={17} />
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground-muted">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={15} className="animate-spin" />
                      Calling predictor and preparing explanation...
                    </span>
                  </div>
                </div>
              )}
              {errorMessage && !loading && (
                <div className="rounded-xl border border-error/25 bg-error-light px-4 py-3 text-sm font-semibold text-error">
                  {errorMessage}
                </div>
              )}
              <div ref={endRef} />
            </div>
          </section>

          <footer className="shrink-0 border-t border-border bg-surface px-5 py-4">
            <div className="mx-auto max-w-4xl mb-21">
              {replyTo && (
                <div className="mb-2 flex items-center gap-2 rounded-xl border border-primary/25 bg-primary-light px-3 py-2 text-xs text-foreground-muted">
                  <MessageSquareReply size={14} className="shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-primary">Following up on Neetell AI</p>
                    <p className="truncate">{replyTo.text}</p>
                  </div>
                  <button type="button" onClick={() => setReplyTo(null)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary/10" aria-label="Cancel follow up">
                    <X size={14} />
                  </button>
                </div>
              )}
              {attachedFile && (
                <div className="mb-2 inline-flex max-w-full items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground-muted">
                  <Paperclip size={13} />
                  <span className="truncate">{attachedFile}</span>
                  <button type="button" onClick={() => setAttachedFile(null)} className="text-foreground-subtle">x</button>
                </div>
              )}

              <div className="grid grid-cols-[42px_1fr_46px] items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground-muted hover:text-primary"
                  aria-label="Attach file"
                >
                  <Paperclip size={17} />
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
                  placeholder="Ask Neetell AI about rank, category, state, quota, or choice filling..."
                  className="min-h-11 max-h-28 resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground-subtle focus:border-border-focus"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim() || !firebaseUser || !desktopActive}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover disabled:bg-disabled disabled:text-foreground-subtle"
                  aria-label="Send message"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={event => setAttachedFile(event.target.files?.[0]?.name ?? null)}
              />
            </div>
          </footer>
        </main>

      </div>
    </>
  );
}
