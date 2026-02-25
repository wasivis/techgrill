'use client';

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Send, Flame, Trophy, Loader2 } from 'lucide-react';
import { finishInterview } from '@/app/actions/interview';

interface Props {
  interviewId: string;
  initialTranscript: any;
  role: string;
}

export default function TechGrillUI({ interviewId, initialTranscript, role }: Props) {
  const [messages, setMessages] = useState(initialTranscript);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("// Write your solution here...\n\nfunction solve() {\n\n}");
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading || isFinished) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages, 
          currentCode: code, 
          role: role,
          interviewId: interviewId 
        }),
      });

      const data = await res.json();
      setMessages((prev: any) => [...prev, data.message]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    setLoading(true);
    const result = await finishInterview(interviewId, messages, code);
    setFeedback(result);
    setIsFinished(true);
    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Sidebar: Chat */}
      <div className="w-[400px] border-r border-zinc-800 flex flex-col bg-zinc-950">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2 font-black text-orange-500 italic">
            <Flame size={18} fill="currentColor" /> TECHGRILL
          </div>
          {!isFinished && (
            <button 
              onClick={handleFinish}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-400 transition"
            >
              Finish Interview
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((m: any, i: number) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === 'user' 
                ? 'bg-orange-600 text-white rounded-tr-none' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          
          {isFinished && feedback && (
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl mt-4">
              <div className="flex items-center gap-2 text-orange-500 font-bold mb-2">
                <Trophy size={16} /> Result & Feedback
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{feedback}</p>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {!isFinished && (
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                placeholder={loading ? "Interviewer is thinking..." : "Explain your logic..."} 
                className="w-full bg-black border border-zinc-800 p-3 pr-10 rounded-xl text-sm outline-none focus:border-orange-500 transition disabled:opacity-50"
              />
              <button 
                onClick={handleSend} 
                disabled={loading}
                className="absolute right-2 top-2.5 text-orange-500 hover:text-white disabled:opacity-30"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main: Editor */}
      <div className="flex-1 flex flex-col">
        <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Solution.js</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>
        <Editor 
          height="100%" 
          theme="vs-dark" 
          defaultLanguage="javascript" 
          value={code} 
          onChange={(v) => setCode(v || "")}
          options={{ 
            fontSize: 15, 
            minimap: { enabled: false }, 
            padding: { top: 20 },
            fontFamily: 'JetBrains Mono, monospace',
            cursorSmoothCaretAnimation: "on"
          }}
        />
      </div>
    </div>
  );
}