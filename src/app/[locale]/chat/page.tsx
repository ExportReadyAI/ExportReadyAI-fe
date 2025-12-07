'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { useChat } from '@/lib/hooks/useChat';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import ChatWelcome from '@/components/chat/ChatWelcome';
import { AlertCircle } from 'lucide-react';

export default function ChatPage() {
  const {
    sessions,
    currentSession,
    messages,
    suggestions,
    isLoading,
    isSending,
    error,
    messagesEndRef,
    sendMessage,
    selectSession,
    newChat,
    deleteSession,
  } = useChat();

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      {/* Main Sidebar */}
      <Sidebar />

      {/* Chat Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sessions Sidebar */}
        <ChatSidebar
          sessions={sessions}
          currentSession={currentSession}
          onSelectSession={selectSession}
          onNewChat={newChat}
          onDeleteSession={deleteSession}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[#F8FAFC]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <ChatWelcome
                suggestions={suggestions}
                onSelectSuggestion={sendMessage}
                isLoading={isLoading}
              />
            ) : (
              <ChatMessages
                messages={messages}
                isSending={isSending}
                messagesEndRef={messagesEndRef}
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-2 px-4 py-3 bg-[#fef2f2] border-2 border-[#fecaca] rounded-2xl flex items-center gap-2">
              <AlertCircle size={18} className="text-[#EF4444]" />
              <span className="text-sm font-medium text-[#EF4444]">{error}</span>
            </div>
          )}

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            disabled={isSending}
          />
        </div>
      </div>
    </div>
  );
}
