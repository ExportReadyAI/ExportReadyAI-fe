# API Documentation - Chatbot Module

Base URL: `/api/v1/chat/`

## Authentication
Semua endpoint memerlukan JWT token:
```
Authorization: Bearer <access_token>
```

**Hanya untuk UMKM users.**

---

## 1. Send Message

Kirim pesan ke AI chatbot dan dapatkan respons.

```
POST /api/v1/chat/send/
```

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | Pesan dari user (max 5000 karakter) |
| session_id | int | No | ID session untuk melanjutkan percakapan |

### Example Request
```json
{
  "message": "Bagaimana cara mendapatkan sertifikat Halal?",
  "session_id": null
}
```

### Example Response
```json
{
  "success": true,
  "message": "Message processed successfully",
  "data": {
    "message": "Untuk mendapatkan sertifikat Halal, Anda perlu mengikuti langkah-langkah berikut:\n\n1. **Daftar di SIHALAL**\n   - Buat akun di sistem BPJPH...",
    "session_id": 1,
    "response_time": 3.45
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| message | string | Respons dari AI chatbot |
| session_id | int | ID session (untuk melanjutkan percakapan) |
| response_time | float | Waktu respons dalam detik |

### Catatan
- Jika `session_id` tidak dikirim, akan dibuat session baru
- Session menyimpan history percakapan untuk konteks yang lebih baik
- AI memiliki akses ke data user (produk, katalog, profil bisnis)

---

## 2. List Chat Sessions

Dapatkan semua chat session milik user.

```
GET /api/v1/chat/sessions/
```

### Example Response
```json
{
  "success": true,
  "message": "Chat sessions retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Bagaimana cara mendapatkan sertifikat Halal?",
      "is_active": true,
      "created_at": "2025-12-07T10:00:00Z",
      "updated_at": "2025-12-07T10:05:00Z",
      "message_count": 4,
      "last_message": {
        "role": "assistant",
        "content": "Untuk mendapatkan sertifikat Halal...",
        "created_at": "2025-12-07T10:05:00Z"
      }
    }
  ]
}
```

---

## 3. Create New Session

Buat session chat baru.

```
POST /api/v1/chat/sessions/
```

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | Judul session (opsional) |

### Example Request
```json
{
  "title": "Pertanyaan tentang ekspor rotan"
}
```

### Example Response
```json
{
  "success": true,
  "message": "Chat session created successfully",
  "data": {
    "id": 2,
    "title": "Pertanyaan tentang ekspor rotan",
    "is_active": true,
    "created_at": "2025-12-07T11:00:00Z",
    "updated_at": "2025-12-07T11:00:00Z",
    "messages": [],
    "message_count": 0
  }
}
```

---

## 4. Get Session Detail

Dapatkan session dengan semua pesan.

```
GET /api/v1/chat/sessions/{session_id}/
```

### Example Response
```json
{
  "success": true,
  "message": "Chat session retrieved successfully",
  "data": {
    "id": 1,
    "title": "Bagaimana cara mendapatkan sertifikat Halal?",
    "is_active": true,
    "created_at": "2025-12-07T10:00:00Z",
    "updated_at": "2025-12-07T10:05:00Z",
    "messages": [
      {
        "id": 1,
        "role": "user",
        "content": "Bagaimana cara mendapatkan sertifikat Halal?",
        "created_at": "2025-12-07T10:00:00Z",
        "metadata": null
      },
      {
        "id": 2,
        "role": "assistant",
        "content": "Untuk mendapatkan sertifikat Halal...",
        "created_at": "2025-12-07T10:00:05Z",
        "metadata": {
          "response_time": 3.45,
          "model": "Claude Sonnet 4.5",
          "tokens_used": 450
        }
      }
    ],
    "message_count": 2
  }
}
```

---

## 5. Delete Session

Hapus (soft delete) session chat.

```
DELETE /api/v1/chat/sessions/{session_id}/
```

### Example Response
```json
{
  "success": true,
  "message": "Chat session deleted successfully",
  "data": {
    "id": 1
  }
}
```

---

## 6. Get Suggested Questions

Dapatkan pertanyaan yang disarankan berdasarkan data user.

```
GET /api/v1/chat/suggestions/
```

### Example Response
```json
{
  "success": true,
  "message": "Suggestions retrieved successfully",
  "data": {
    "suggestions": [
      "Sertifikasi apa yang diperlukan untuk ekspor Tas Rotan Handmade?",
      "Berapa estimasi biaya kirim Tas Rotan Handmade ke Singapura?",
      "Apa saja dokumen yang diperlukan untuk ekspor?",
      "Bagaimana cara menghitung harga ekspor FOB?",
      "Negara mana yang cocok untuk produk saya?"
    ]
  }
}
```

### Catatan
- Suggestions disesuaikan berdasarkan produk dan profil user
- Jika user belum punya produk, akan diberikan pertanyaan umum

---

## Frontend Implementation Guide (Next.js + TypeScript)

Panduan lengkap untuk membuat halaman Chatbot di frontend Next.js.

---

### Step 1: Buat Types/Interfaces

**File: `src/types/chat.ts`**

```typescript
// Types untuk Chatbot API
export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
  metadata?: {
    response_time?: number;
    model?: string;
    tokens_used?: number;
  };
}

export interface ChatSession {
  id: number;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
  message_count: number;
  last_message?: {
    role: string;
    content: string;
    created_at: string;
  };
}

export interface SendMessageRequest {
  message: string;
  session_id?: number | null;
}

export interface SendMessageResponse {
  message: string;
  session_id: number;
  response_time: number;
}

export interface SuggestionsResponse {
  suggestions: string[];
}
```

---

### Step 2: Buat API Service

**File: `src/services/chatService.ts`**

```typescript
import api from '@/lib/axios'; // axios instance dengan baseURL dan token
import {
  ChatSession,
  SendMessageRequest,
  SendMessageResponse,
  SuggestionsResponse
} from '@/types/chat';

export const chatService = {
  // Kirim pesan ke chatbot
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await api.post('/chat/send/', data);
    return response.data.data;
  },

  // List semua sessions
  async getSessions(): Promise<ChatSession[]> {
    const response = await api.get('/chat/sessions/');
    return response.data.data;
  },

  // Get session detail dengan messages
  async getSession(sessionId: number): Promise<ChatSession> {
    const response = await api.get(`/chat/sessions/${sessionId}/`);
    return response.data.data;
  },

  // Buat session baru
  async createSession(title?: string): Promise<ChatSession> {
    const response = await api.post('/chat/sessions/', { title });
    return response.data.data;
  },

  // Hapus session
  async deleteSession(sessionId: number): Promise<void> {
    await api.delete(`/chat/sessions/${sessionId}/`);
  },

  // Get suggested questions
  async getSuggestions(): Promise<string[]> {
    const response = await api.get('/chat/suggestions/');
    return response.data.data.suggestions;
  },
};
```

---

### Step 3: Buat Custom Hook

**File: `src/hooks/useChat.ts`**

```typescript
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '@/services/chatService';
import { ChatSession, ChatMessage } from '@/types/chat';

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load sessions
  const loadSessions = useCallback(async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }, []);

  // Load suggestions
  const loadSuggestions = useCallback(async () => {
    try {
      const data = await chatService.getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  }, []);

  // Initialize
  useEffect(() => {
    setIsLoading(true);
    Promise.all([loadSessions(), loadSuggestions()])
      .finally(() => setIsLoading(false));
  }, [loadSessions, loadSuggestions]);

  // Scroll saat messages berubah
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Select session
  const selectSession = useCallback(async (session: ChatSession) => {
    try {
      setIsLoading(true);
      const fullSession = await chatService.getSession(session.id);
      setCurrentSession(fullSession);
      setMessages(fullSession.messages || []);
    } catch (err) {
      setError('Gagal memuat percakapan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // New chat
  const newChat = useCallback(() => {
    setCurrentSession(null);
    setMessages([]);
    setError(null);
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;

    setError(null);
    setIsSending(true);

    // Optimistic update - tambah message user langsung
    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await chatService.sendMessage({
        message: content.trim(),
        session_id: currentSession?.id || null,
      });

      // Tambah response AI
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        created_at: new Date().toISOString(),
        metadata: { response_time: response.response_time },
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update session jika baru
      if (!currentSession) {
        setCurrentSession({ id: response.session_id } as ChatSession);
        loadSessions(); // Refresh list
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengirim pesan');
      // Hapus user message jika gagal
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  }, [currentSession, isSending, loadSessions]);

  // Delete session
  const deleteSession = useCallback(async (sessionId: number) => {
    try {
      await chatService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        newChat();
      }
    } catch (err) {
      setError('Gagal menghapus percakapan');
    }
  }, [currentSession, newChat]);

  return {
    // State
    sessions,
    currentSession,
    messages,
    suggestions,
    isLoading,
    isSending,
    error,
    messagesEndRef,

    // Actions
    sendMessage,
    selectSession,
    newChat,
    deleteSession,
    loadSessions,
  };
}
```

---

### Step 4: Buat Components

#### 4.1 Chat Page

**File: `src/app/[locale]/(dashboard)/chat/page.tsx`**

```tsx
'use client';

import { useChat } from '@/hooks/useChat';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import ChatWelcome from '@/components/chat/ChatWelcome';

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
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSession={currentSession}
        onSelectSession={selectSession}
        onNewChat={newChat}
        onDeleteSession={deleteSession}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
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
          <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          disabled={isSending}
        />
      </div>
    </div>
  );
}
```

#### 4.2 Chat Sidebar Component

**File: `src/components/chat/ChatSidebar.tsx`**

```tsx
'use client';

import { ChatSession } from '@/types/chat';
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
    <div className="w-72 bg-gray-50 border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2
                     bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     transition-colors"
        >
          <Plus size={18} />
          <span>Chat Baru</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada percakapan</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`group p-3 rounded-lg cursor-pointer transition-colors
                  ${currentSession?.id === session.id
                    ? 'bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {session.title || 'Percakapan Baru'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {session.message_count} pesan • {' '}
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
                    className="p-1 rounded opacity-0 group-hover:opacity-100
                               hover:bg-red-100 hover:text-red-600 transition-all"
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
```

#### 4.3 Chat Messages Component

**File: `src/components/chat/ChatMessages.tsx`**

```tsx
'use client';

import { ChatMessage } from '@/types/chat';
import { User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
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
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
              }`}
          >
            {message.role === 'user' ? (
              <User size={16} />
            ) : (
              <Bot size={16} />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            }`}
          >
            {message.role === 'user' ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}

            {/* Response time for assistant */}
            {message.role === 'assistant' && message.metadata?.response_time && (
              <p className="text-xs text-gray-400 mt-2">
                {message.metadata.response_time.toFixed(1)}s
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isSending && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Bot size={16} className="text-gray-600" />
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Mengetik...</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
```

#### 4.4 Chat Welcome Component

**File: `src/components/chat/ChatWelcome.tsx`**

```tsx
'use client';

import { Bot, Sparkles } from 'lucide-react';

interface ChatWelcomeProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  isLoading: boolean;
}

export default function ChatWelcome({
  suggestions,
  onSelectSuggestion,
  isLoading,
}: ChatWelcomeProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      {/* Icon */}
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Bot size={32} className="text-blue-600" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Asisten Ekspor AI
      </h1>
      <p className="text-gray-600 mb-8">
        Tanyakan apa saja tentang ekspor produk Anda. Saya siap membantu!
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-left">
        {[
          'Dokumen & Sertifikasi Ekspor',
          'Perhitungan Harga FOB/CIF',
          'Rekomendasi Negara Tujuan',
          'Prosedur & Regulasi',
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles size={14} className="text-blue-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {!isLoading && suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500 mb-3">Coba tanyakan:</p>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelectSuggestion(suggestion)}
              className="block w-full text-left px-4 py-3 bg-white border
                         border-gray-200 rounded-xl hover:border-blue-300
                         hover:bg-blue-50 transition-colors text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 4.5 Chat Input Component

**File: `src/components/chat/ChatInput.tsx`**

```tsx
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
    <div className="border-t bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-gray-50 rounded-2xl p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan Anda..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent px-3 py-2
                       focus:outline-none text-sm max-h-32"
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
            className="p-2 bg-blue-600 text-white rounded-xl
                       hover:bg-blue-700 disabled:opacity-50
                       disabled:cursor-not-allowed transition-colors"
          >
            {disabled ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">
          Tekan Enter untuk kirim, Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}
```

---

### Step 5: Dependencies yang Diperlukan

```bash
npm install react-markdown date-fns lucide-react
```

---

### Step 6: Axios Instance Setup

**File: `src/lib/axios.ts`**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tambah token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login atau refresh token
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Struktur Folder

```
src/
├── app/
│   └── [locale]/
│       └── (dashboard)/
│           └── chat/
│               └── page.tsx          # Halaman utama chat
├── components/
│   └── chat/
│       ├── ChatSidebar.tsx           # Sidebar sessions
│       ├── ChatMessages.tsx          # List messages
│       ├── ChatWelcome.tsx           # Welcome screen
│       └── ChatInput.tsx             # Input area
├── hooks/
│   └── useChat.ts                    # Custom hook
├── services/
│   └── chatService.ts                # API calls
├── types/
│   └── chat.ts                       # TypeScript types
└── lib/
    └── axios.ts                      # Axios instance
```

---

### Preview Tampilan

```
┌────────────────────────────────────────────────────────────────┐
│ ┌──────────────┐  ┌─────────────────────────────────────────┐ │
│ │ + Chat Baru  │  │                                         │ │
│ ├──────────────┤  │     🤖 Asisten Ekspor AI                │ │
│ │              │  │                                         │ │
│ │ 📝 Dokumen   │  │  Tanyakan apa saja tentang ekspor...    │ │
│ │    ekspor    │  │                                         │ │
│ │    3 pesan   │  │  ┌─────────────────────────────────┐    │ │
│ │              │  │  │ Sertifikasi untuk Tas Rotan?    │    │ │
│ │ 📝 Harga FOB │  │  └─────────────────────────────────┘    │ │
│ │    5 pesan   │  │  ┌─────────────────────────────────┐    │ │
│ │              │  │  │ Dokumen ekspor ke Singapura?    │    │ │
│ └──────────────┘  │  └─────────────────────────────────┘    │ │
│                   │                                         │ │
│                   ├─────────────────────────────────────────┤ │
│                   │ ┌─────────────────────────────────────┐ │ │
│                   │ │ Ketik pertanyaan...          [📤]  │ │ │
│                   │ └─────────────────────────────────────┘ │ │
│                   └─────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Knowledge Base

Chatbot memiliki knowledge base tentang:
1. **Dokumen Ekspor** - Invoice, Packing List, B/L, SKA, PEB
2. **Sertifikasi** - Halal, ISO, HACCP, SVLK, SNI
3. **Incoterms** - EXW, FOB, CIF, DDP
4. **Prosedur Ekspor** - Langkah-langkah dan timeline
5. **Metode Pembayaran** - L/C, T/T, CAD
6. **Negara Tujuan** - Tips per region
7. **HS Code** - Klasifikasi produk
8. **Perhitungan Harga** - Komponen FOB, CIF

Chatbot juga menggunakan data user (produk, katalog, profil bisnis) untuk memberikan saran yang lebih spesifik.

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "message": ["This field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "detail": "Given token not valid for any token type"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Chat session not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Chatbot service error",
  "errors": {
    "detail": "Error message here"
  }
}
```

---

## Tips

1. **Loading State**: Tampilkan typing indicator saat menunggu respons AI (bisa 3-10 detik)
2. **Error Handling**: Tampilkan pesan error yang user-friendly
3. **Session Management**: Simpan session_id di state/localStorage untuk melanjutkan percakapan
4. **Suggestions**: Tampilkan suggested questions di awal chat untuk membantu user memulai
5. **Mobile Responsive**: Pastikan chat interface responsive di mobile
