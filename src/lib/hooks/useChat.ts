'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '@/lib/api/services';
import type { ChatSession, ChatMessage } from '@/lib/api/types';

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
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

  // Scroll when messages change
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

    // Optimistic update - add user message immediately
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

      // Add AI response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        created_at: new Date().toISOString(),
        metadata: { response_time: response.response_time },
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update session if new
      if (!currentSession) {
        setCurrentSession({ id: response.session_id } as ChatSession);
        loadSessions(); // Refresh list
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengirim pesan');
      // Remove user message if failed
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
