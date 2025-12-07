"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { ArrowLeft, Bot, Send, Loader2, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CoachPage() {
  const { loading: authLoading } = useRequireAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Sorry, I couldn't process that request. Please try again." 
        }]);
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, something went wrong. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col pt-16">
      {/* Header */}
      <header className="border-b border-stone-800/50 px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-300 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Coach</h1>
              <p className="text-sm text-stone-500">Ask me anything about fitness</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/5 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-rose-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">How can I help?</h2>
              <p className="text-stone-500 max-w-sm mx-auto mb-8">
                Ask me about workout tips, nutrition advice, or anything fitness related.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "How do I build muscle?",
                  "Best exercises for core",
                  "Pre-workout nutrition tips"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2.5 text-sm text-stone-400 bg-stone-900 border border-stone-800/50 rounded-xl hover:bg-stone-800 hover:text-white hover:border-stone-700/50 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, idx) => (
              <div 
                key={idx}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-rose-400" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${
                  message.role === "user" 
                    ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white" 
                    : "bg-stone-900 border border-stone-800/50 text-stone-200"
                } rounded-2xl px-5 py-3.5`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-teal-400" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-rose-400" />
              </div>
              <div className="bg-stone-900 border border-stone-800/50 rounded-2xl px-5 py-3.5">
                <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-stone-800/50 px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 px-5 py-3.5 bg-stone-900 border border-stone-800/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:text-stone-500 text-white rounded-xl shadow-lg shadow-teal-500/20 disabled:shadow-none transition-all duration-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
