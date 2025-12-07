'use client';

import type { ChatMessage } from '@/lib/api/types';
import { User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  isSending,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex gap-3 ${
            message.role === 'user' ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md
              ${message.role === 'user'
                ? 'bg-[#0284C7] text-white shadow-[0_3px_0_0_#065985]'
                : 'bg-[#F59E0B] text-white shadow-[0_3px_0_0_#d97706]'
              }`}
          >
            {message.role === 'user' ? (
              <User size={18} />
            ) : (
              <Bot size={18} />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-[#0284C7] text-white rounded-tr-md shadow-[0_3px_0_0_#065985]'
                : 'bg-white text-[#0C4A6E] rounded-tl-md border-2 border-[#e0f2fe] shadow-[0_3px_0_0_#e0f2fe]'
            }`}
          >
            {message.role === 'user' ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-headings:text-[#0C4A6E] prose-p:text-[#334155] prose-strong:text-[#0C4A6E] prose-li:text-[#334155]">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}

            {/* Response time for assistant */}
            {message.role === 'assistant' && message.metadata?.response_time && (
              <p className="text-xs text-[#94a3b8] mt-2 font-medium">
                {message.metadata.response_time.toFixed(1)}s
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isSending && (
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] flex items-center justify-center shadow-[0_3px_0_0_#d97706]">
            <Bot size={18} className="text-white" />
          </div>
          <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 border-2 border-[#e0f2fe] shadow-[0_3px_0_0_#e0f2fe]">
            <div className="flex items-center gap-2 text-[#64748b]">
              <Loader2 size={16} className="animate-spin text-[#0284C7]" />
              <span className="text-sm font-medium">Mengetik...</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
