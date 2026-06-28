import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Send, Bot, User, Volume2 } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  emotion?: 'happy' | 'thinking' | 'celebrating';
}

const botResponses: Record<string, string> = {
  'hello': 'Namaste! I am EduBot, your AI study buddy! How can I help you learn today?',
  'hi': 'Hello there! Ready to learn something amazing?',
  'help': 'I can help you with: explanations, quizzes, translations, career guidance, and more! Just ask.',
  'photosynthesis': 'Photosynthesis is like a magic recipe! Plants use sunlight + water + CO2 = food + oxygen. The leaf is their kitchen!',
  'gravity': 'Gravity is the invisible hug that keeps us on Earth! Newton discovered it when an apple fell on his head.',
  'quiz': 'I can create a quiz on any topic! Just tell me the subject and difficulty.',
  'career': 'Want to know what careers relate to your topic? I can show you real-world jobs!',
  'story': 'I love stories! I can turn any boring topic into an exciting comic adventure!',
  'joke': 'Why did the physics teacher break up with the biology teacher? There was no chemistry!',
  'motivate': 'You are doing amazing! Every question you answer makes your brain stronger. Keep going!',
};

const defaultSuggestions = [
  'Explain Photosynthesis',
  'Create a quiz',
  'Tell me a science joke',
  'What careers use Gravity?',
  'Motivate me!',
];

export function EduBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hello! I am EduBot, your AI study buddy! I speak Hinglish too! Ask me anything about your lessons.',
      emotion: 'happy',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { speak } = useSpeech();

  const getBotResponse = (userText: string): string => {
    const lower = userText.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
      if (lower.includes(key)) return response;
    }
    if (lower.includes('?')) {
      return 'That is a great question! I am still learning, but I would suggest checking the Lessons section or asking your teacher for more details.';
    }
    return 'Interesting! I am learning every day. Try asking me about a specific topic like Photosynthesis, Gravity, or ask for a quiz!';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(userMsg.text);
      const emotion: ChatMessage['emotion'] = response.includes('amazing') || response.includes('celebrat') ? 'celebrating' : 'happy';
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response,
        emotion,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Bot className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] glass-card border border-white/10 overflow-hidden flex flex-col"
            style={{ maxHeight: '600px' }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1E293B]" />
              </div>
              <div>
                <div className="text-white font-semibold">EduBot</div>
                <div className="text-xs text-slate-400">AI Study Buddy</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide" style={{ maxHeight: '400px' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'bot'
                      ? 'bg-gradient-to-br from-primary to-secondary'
                      : 'bg-white/10'
                  }`}>
                    {msg.role === 'bot' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'bot'
                      ? 'bg-white/5 text-slate-300 rounded-tl-none'
                      : 'bg-primary/20 text-white rounded-tr-none'
                  }`}>
                    <p>{msg.text}</p>
                    {msg.role === 'bot' && (
                      <button
                        onClick={() => speak(msg.text)}
                        className="mt-2 p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-slate-500" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {defaultSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(suggestion)}
                    className="px-3 py-1.5 bg-white/5 text-slate-400 text-xs rounded-full hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask EduBot anything..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
