'use client';

import { Bot, Sparkles, FileText, DollarSign, Globe, ClipboardList, Loader2 } from 'lucide-react';

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
  const features = [
    { icon: FileText, text: 'Dokumen & Sertifikasi Ekspor', color: '#0284C7' },
    { icon: DollarSign, text: 'Perhitungan Harga FOB/CIF', color: '#22C55E' },
    { icon: Globe, text: 'Rekomendasi Negara Tujuan', color: '#8B5CF6' },
    { icon: ClipboardList, text: 'Prosedur & Regulasi', color: '#F59E0B' },
  ];

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      {/* Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-[#0284C7] to-[#0369a1] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_6px_0_0_#065985]">
        <Bot size={40} className="text-white" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
        Asisten Ekspor AI
      </h1>
      <p className="text-[#64748b] mb-8 font-medium">
        Tanyakan apa saja tentang ekspor produk Anda. Saya siap membantu!
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-[#e0f2fe] shadow-[0_3px_0_0_#e0f2fe]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <Icon size={20} style={{ color: feature.color }} />
              </div>
              <span className="text-sm font-bold text-[#0C4A6E] text-left">
                {feature.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Suggestions */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-[#64748b] py-4">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Memuat saran...</span>
        </div>
      ) : suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#F59E0B]" />
            <p className="text-sm font-bold text-[#64748b]">Coba tanyakan:</p>
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelectSuggestion(suggestion)}
              className="block w-full text-left px-4 py-3 bg-white border-2
                         border-[#e0f2fe] rounded-2xl hover:border-[#0284C7]
                         hover:bg-[#F0F9FF] transition-all text-sm font-medium
                         text-[#0C4A6E] shadow-[0_3px_0_0_#e0f2fe]
                         hover:shadow-[0_3px_0_0_#bae6fd] hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
