import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, AlertCircle, Play } from 'lucide-react';

interface VoiceSearchProps {
  onTranscript: (text: string) => void;
  onClose: () => void;
}

export default function VoiceSearch({ onTranscript, onClose }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('Listening...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeout1: any;
    let timeout2: any;

    if (isListening) {
      setError(null);
      setTranscript('Listening... Speak now');
      
      // Simulate real-time word detection
      timeout1 = setTimeout(() => {
        setTranscript('"flights to Mumbai on next Friday..."');
      }, 1500);

      timeout2 = setTimeout(() => {
        setTranscript('Flights to Mumbai on next Friday');
        setIsListening(false);
      }, 3500);
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [isListening]);

  const handleApply = () => {
    if (transcript && transcript !== 'Listening...' && transcript !== 'Listening... Speak now') {
      onTranscript(transcript);
    }
  };

  const simulatedPhrases = [
    'Train from Delhi to Amritsar tomorrow',
    'Bus to Pune sleeper seat',
    'Coldplay concerts next month',
    'Oppenheimer movie showtimes tonight'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl"></div>
        <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-teal-500/10 blur-xl"></div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center space-x-1.5 items-center mb-2 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest font-mono">Omni Voice Search</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Search by Speaking</h3>
        </div>

        {/* Animated wave */}
        <div className="flex justify-center items-center h-28 mb-6">
          {isListening ? (
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-10 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-16 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-20 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="w-1.5 h-14 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></span>
              <span className="w-1.5 h-8 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></span>
            </div>
          ) : (
            <button 
              onClick={() => setIsListening(true)}
              className="p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
            >
              <Mic className="h-8 w-8" />
            </button>
          )}
        </div>

        {/* Live Transcript Display */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 mb-6 min-h-24 flex flex-col justify-center text-center">
          <p className={`text-sm leading-relaxed ${isListening ? 'text-slate-400 italic' : 'text-slate-800 dark:text-slate-200 font-semibold'}`}>
            {transcript}
          </p>
        </div>

        {/* Action button */}
        {!isListening && (
          <div className="flex space-x-2.5 mb-6">
            <button 
              onClick={() => setIsListening(true)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            >
              Retry
            </button>
            <button 
              onClick={handleApply}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-emerald-500/10"
            >
              Use Search
            </button>
          </div>
        )}

        {/* Simulators */}
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5 text-center">Simulated Phrases (Click to Test)</p>
          <div className="space-y-1.5">
            {simulatedPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(phrase);
                  setIsListening(false);
                }}
                className="w-full text-left p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-100 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 flex items-center space-x-2 group transition"
              >
                <Play className="h-3 w-3 text-emerald-500 group-hover:scale-110" />
                <span className="truncate">{phrase}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
