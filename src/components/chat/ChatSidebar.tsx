'use client';

import type { ChatSession } from '@/lib/api/types';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: number) => void;
}

export default function ChatSidebar({
  sessions,
  currentSession,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatSidebarProps) {
  return (
    <div className="w-72 bg-white border-r-2 border-[#e0f2fe] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-[#e0f2fe]">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3
                     bg-[#0284C7] text-white rounded-2xl font-bold
                     shadow-[0_4px_0_0_#065985] hover:-translate-y-0.5
                     active:translate-y-0 active:shadow-none transition-all"
        >
          <Plus size={18} />
          <span>Chat Baru</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="px-3 py-2 text-xs font-bold text-[#7DD3FC] uppercase tracking-wider mb-2">
          Riwayat Chat
        </p>
        {sessions.length === 0 ? (
          <div className="text-center text-[#94a3b8] py-8">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Belum ada percakapan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`group p-3 rounded-2xl cursor-pointer transition-all duration-200
                  ${currentSession?.id === session.id
                    ? 'bg-[#0284C7] text-white shadow-[0_4px_0_0_#065985] -translate-y-0.5'
                    : 'bg-[#F0F9FF] hover:bg-[#e0f2fe] hover:shadow-[0_4px_0_0_#bae6fd] hover:-translate-y-0.5'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${
                      currentSession?.id === session.id ? 'text-white' : 'text-[#0C4A6E]'
                    }`}>
                      {session.title || 'Percakapan Baru'}
                    </p>
                    <p className={`text-xs mt-1 ${
                      currentSession?.id === session.id ? 'text-white/70' : 'text-[#64748b]'
                    }`}>
                      {session.message_count} pesan •{' '}
                      {formatDistanceToNow(new Date(session.updated_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className={`p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all
                      ${currentSession?.id === session.id
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-[#fecaca] hover:text-[#EF4444]'
                      }`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
