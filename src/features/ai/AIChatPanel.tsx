'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSendAiMessageMutation } from '@/features/ai/aiApi';
import { X, Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface AIChatPanelProps {
  projectId: string;
  projectName?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ projectId, projectName, onClose, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Merhaba! 👋 Proje hakkında sorularınızı cevaplayabilirim. Örneğin:\n\n• "Bu projede neler yapılıyor?"\n• "Kartları nasıl daha iyi organize edebilirim?"\n• "Takım üyelerinin iş yükü nasıl?"`,
      id: 'welcome',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sendMessage, { isLoading }] = useSendAiMessageMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    const userMsg: Message = { role: 'user', content: text, id: `user-${Date.now()}` };
    setMessages((prev) => [...prev, userMsg]);

    const apiMessages = [
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: text },
    ];

    try {
      const reply = await sendMessage({ projectId, messages: apiMessages }).unwrap();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, id: `assistant-${Date.now()}` },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
          id: `error-${Date.now()}`,
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col bg-background border-l ${isMobile ? 'fixed inset-0 z-50' : 'h-full rounded-r-xl border'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-semibold">AI Asistan</h3>
            {projectName && (
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{projectName}</p>
            )}
          </div>
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted transition-colors"
            title="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="mt-1 shrink-0">
                <Bot className="h-6 w-6 rounded-full bg-primary/10 p-1 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted rounded-tl-sm'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="mt-1 shrink-0">
                <User className="h-6 w-6 rounded-full bg-primary/10 p-1 text-primary" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 items-center text-muted-foreground">
            <Bot className="h-6 w-6 rounded-full bg-primary/10 p-1 text-primary" />
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            disabled={isLoading}
            className="flex-1 rounded-full border bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
            title="Gönder"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">
          AI cevapları yönlendirme amaçlıdır, aksiyon almadan önce doğrulayın.
        </p>
      </div>
    </div>
  );
};
