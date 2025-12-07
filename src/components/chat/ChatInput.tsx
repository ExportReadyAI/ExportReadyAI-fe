'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t-2 border-[#e0f2fe] bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-[#F0F9FF] rounded-2xl p-3 border-2 border-[#e0f2fe]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan Anda..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent px-3 py-2
                       focus:outline-none text-sm font-medium text-[#0C4A6E]
                       placeholder:text-[#94a3b8] max-h-32"
            style={{
              height: 'auto',
              minHeight: '40px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="p-3 bg-[#0284C7] text-white rounded-xl
                       shadow-[0_3px_0_0_#065985] hover:-translate-y-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:translate-y-0 disabled:shadow-[0_3px_0_0_#065985]
                       active:translate-y-0 active:shadow-none transition-all"
          >
            {disabled ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        <p className="text-xs text-[#94a3b8] text-center mt-2 font-medium">
          Tekan Enter untuk kirim, Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}
