import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
import { BACKEND_URL } from './env.ts'

import { 
  BookOpen, 
  Home, 
  Compass, 
  Users, 
  Medal, 
  User as UserIcon, 
  ChevronRight, 
  Search, 
  Plus, 
  Heart, 
  MessageCircle, 
  X,
  Sparkles,
  Flame,
  Star,
  WifiOff,
  AlertCircle,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User as UserInputIcon,
  LogOut,
  BookMarked,
  BookCopy,
  ShieldAlert,
  ChevronDown,
  Info,
  Sun,
  Moon,
  Edit3
} from 'lucide-react';

// --- Types & Interfaces ---

enum ThreadType {
  Quote = 0,
  Progress = 1,
  Review = 2,
  Thought = 3
}

interface User {
  id: string;
  username: string;
  avatarLink?: string;
  bio?: string;
}

interface Book {
  isbn: string;
  title: string;
  author?: string;
  thumbnail?: string;
  imageUrl?: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  user?: User;
  createdAt: string;
}

interface Thread {
  id: number;
  content: string;
  threadType: ThreadType;
  isSpoiler: boolean;
  createdAt: string;
  userId: string;
  user?: User;
  bookISBN?: string;
  book?: Book;
  comments?: Comment[];
  likesCount?: number;
  progressPercentage?: number;
}

interface UserBook {
  bookISBN: string;
  book?: Book;
  status: string; // "reading" | "read" | "want"
  progress?: number;
}

// --- Configuration ---
const BACKEND_API_URL = BACKEND_URL;
const DEMO_CREDENTIALS = { username: 'guest_reader', password: 'password123' };

const MOCK_USER: User = {
  id: "2b34f5e6-eafa-4849-b6a6-3ead51e04267",
  username: "guest_reader",
  avatarLink: "https://api.dicebear.com/7.x/adventurer/svg?seed=guest",
};

// --- Expanded Dummy Data for Fallback ---
const DUMMY_THREADS: Thread[] = [
  {
    id: 1,
    content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    threadType: ThreadType.Quote,
    isSpoiler: false,
    createdAt: new Date().toISOString(),
    userId: "user-1",
    user: { id: "user-1", username: "jane_austen", avatarLink: "https://api.dicebear.com/7.x/adventurer/svg?seed=jane" },
    book: { isbn: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen" }
  },
  {
    id: 2,
    content: "Halfway through this academic thriller! The characters are so well written and the tension is palpable. Highly recommend for fans of The Secret History.",
    threadType: ThreadType.Progress,
    isSpoiler: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    userId: "user-2",
    user: { id: "user-2", username: "dark_acad", avatarLink: "https://api.dicebear.com/7.x/adventurer/svg?seed=acad" },
    book: { isbn: "9780679763352", title: "The Secret History", thumbnail: "https://covers.openlibrary.org/b/id/10524397-M.jpg", author: "Donna Tartt" },
    progressPercentage: 54,
    likesCount: 12
  },
  {
    id: 3,
    content: "Just finished 'The Great Gatsby'. The prose is unmatched, but I find Gatsby's obsession more tragic than romantic. A 5-star masterpiece nonetheless.",
    threadType: ThreadType.Review,
    isSpoiler: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userId: "user-3",
    user: { id: "user-3", username: "fitz_fan", avatarLink: "https://api.dicebear.com/7.x/adventurer/svg?seed=fitz" },
    book: { isbn: "9780743273565", title: "The Great Gatsby", thumbnail: "https://covers.openlibrary.org/b/id/8432047-M.jpg", author: "F. Scott Fitzgerald" },
    likesCount: 45,
    comments: [
      { id: "c1", content: "Agreed, the American dream is dissected so brutally here.", userId: "user-1", createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 4,
    content: "I'm starting 'The Hobbit' for the first time! Bilbo is such a relatable character. 'In a hole in the ground there lived a hobbit.'",
    threadType: ThreadType.Thought,
    isSpoiler: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    userId: "user-4",
    user: { id: "user-4", username: "shire_bound", avatarLink: "https://api.dicebear.com/7.x/adventurer/svg?seed=bilbo" },
    book: { isbn: "9780547928227", title: "The Hobbit", author: "J.R.R. Tolkien" },
    likesCount: 8
  },
  {
    id: 5,
    content: "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.",
    threadType: ThreadType.Quote,
    isSpoiler: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    userId: "user-5",
    user: { id: "user-5", username: "sirius_black", avatarLink: "https://api.dicebear.com/7.x/adventurer/svg?seed=sirius" },
    book: { isbn: "9780439358071", title: "HP and the Order of the Phoenix", author: "J.K. Rowling" },
    likesCount: 156
  }
];


const DUMMY_USER_BOOKS: UserBook[] = [
  { bookISBN: "9780439358071", status: "reading", progress: 65, book: { isbn: "9780439358071", title: "HP & The Order of the Phoenix", author: "J.K. Rowling", thumbnail: "https://covers.openlibrary.org/b/isbn/9780439358071-M.jpg" }},
  { bookISBN: "9780679763352", status: "reading", progress: 30, book: { isbn: "9780679763352", title: "The Secret History", author: "Donna Tartt", thumbnail: "https://covers.openlibrary.org/b/id/10524397-M.jpg" }},
  { bookISBN: "9780141439518", status: "read", book: { isbn: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen", thumbnail: "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg" }},
  { bookISBN: "9780743273565", status: "read", book: { isbn: "9780743273565", title: "The Great Gatsby", author: "F. Scott Fitzgerald", thumbnail: "https://covers.openlibrary.org/b/id/8432047-M.jpg" }},
  { bookISBN: "9780547928227", status: "read", book: { isbn: "9780547928227", title: "The Hobbit", author: "J.R.R. Tolkien", thumbnail: "https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg" }},
  { bookISBN: "9780316769174", status: "read", book: { isbn: "9780316769174", title: "The Catcher in the Rye", author: "J.D. Salinger", thumbnail: "https://covers.openlibrary.org/b/isbn/9780316769174-M.jpg" }},
  { bookISBN: "9780060935467", status: "want", book: { isbn: "9780060935467", title: "To Kill a Mockingbird", author: "Harper Lee", thumbnail: "https://covers.openlibrary.org/b/isbn/9780060935467-M.jpg" }},
  { bookISBN: "9780451524935", status: "want", book: { isbn: "9780451524935", title: "1984", author: "George Orwell", thumbnail: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg" }},
];

const DUMMY_PROFILE_THREADS: Thread[] = [
  { id: 1, content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", threadType: ThreadType.Quote, isSpoiler: false, createdAt: new Date(Date.now() - 172800000).toISOString(), userId: "me", book: { isbn: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen" }, likesCount: 24, comments: Array(8) },
  { id: 3, content: "Just finished The Secret History. Donna Tartt's prose is absolutely intoxicating — this book consumed me entirely for a week.", threadType: ThreadType.Review, isSpoiler: false, createdAt: new Date(Date.now() - 604800000).toISOString(), userId: "me", book: { isbn: "9780679763352", title: "The Secret History", author: "Donna Tartt" }, likesCount: 61, comments: Array(14) },
  { id: 2, content: "65% through HP & The Order of the Phoenix. The political commentary hits differently as an adult.", threadType: ThreadType.Progress, isSpoiler: false, createdAt: new Date(Date.now() - 259200000).toISOString(), userId: "me", book: { isbn: "9780439358071", title: "HP & The Order of the Phoenix", author: "J.K. Rowling" }, progressPercentage: 65, likesCount: 18, comments: Array(5) },
];


// Helper: check if a token is the demo token (skip real API calls)
const isDemoToken = (token: string | null) => token === 'demo-jwt-token';

// Helper: synchronously attach auth header before a request
const getAuthHeaders = (token: string | null) =>
  token && !isDemoToken(token) ? { Authorization: `Bearer ${token}` } : {};

// --- Theme Components ---

const DarkModeToggle = ({ isDarkMode, toggle }: { isDarkMode: boolean, toggle: () => void }) => (
  <button
    onClick={toggle}
    className="p-3 bg-white dark:bg-book-card border border-book-border rounded-2xl text-book-dark hover:scale-110 active:scale-95 transition-all shadow-md theme-transition z-[500]"
    aria-label="Toggle Dark Mode"
  >
    {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-book-accent" />}
  </button>
);

const PoofEffect = () => (
  <div className="fixed top-12 right-12 z-[500] pointer-events-none">
    <div className="relative">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-stone-200/60 dark:bg-stone-600/60 rounded-full animate-poof"
          style={{
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            top: `${Math.random() * 60 - 30}px`,
            left: `${Math.random() * 60 - 30}px`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  </div>
);

const BookwormCartoon = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm flex-shrink-0">
    <rect x="20" y="30" width="60" height="50" rx="6" fill="#D7CCC8" stroke="#3E2C28" strokeWidth="2" />
    <path d="M20 35 L80 35 M20 45 L80 45 M20 55 L80 55 M20 65 L80 65" stroke="#3E2C28" strokeWidth="1" opacity="0.3" />
    <circle cx="40" cy="50" r="8" fill="white" stroke="#3E2C28" strokeWidth="1" />
    <circle cx="60" cy="50" r="8" fill="white" stroke="#3E2C28" strokeWidth="1" />
    <g className="animate-pupil-sequence">
      <circle cx="40" cy="50" r="4" fill="#3E2C28" />
      <circle cx="60" cy="50" r="4" fill="#3E2C28" />
    </g>
    <path d="M45 65 Q50 70 55 65" fill="none" stroke="#3E2C28" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HintPopup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed top-20 right-8 z-[450] flex flex-col items-end animate-fade-in-up">
    <div className="bg-white dark:bg-book-card p-4 rounded-3xl shadow-2xl border border-book-border max-w-[240px] relative theme-transition">
      <div className="flex gap-3 items-center mb-3">
        <BookwormCartoon />
        <p className="text-[11px] font-serif italic text-book-dark leading-relaxed">
          "There's a cool trick i wanna show you if you click this..."
        </p>
      </div>
      <button
        onClick={onClose}
        className="w-full py-1.5 bg-book-sidebar dark:bg-book-main rounded-xl text-[9px] font-black uppercase tracking-widest text-book-muted hover:text-book-dark transition-colors"
      >
        I'm good
      </button>
      <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white dark:border-b-book-card"></div>
    </div>
  </div>
);

const DemoWarningModal = ({ onProceed, onCancel }: { onProceed: () => void, onCancel: () => void }) => (
  <div className="fixed inset-0 bg-book-dark/70 backdrop-blur-md z-[600] flex items-center justify-center p-4">
    <div className="bg-white dark:bg-book-card w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-book-border animate-fade-in-up theme-transition">
      <div className="text-center mb-6">
        <div className="inline-flex p-4 bg-amber-50 dark:bg-amber-900/20 rounded-3xl text-amber-600 dark:text-amber-400 shadow-sm mb-4 border border-amber-100 dark:border-amber-800/30">
          <ShieldAlert size={40} />
        </div>
        <h2 className="font-display text-2xl font-black text-book-dark mb-2">Demo Mode Warning</h2>
        <p className="text-book-muted font-serif italic text-sm leading-relaxed px-4">
          You are entering the library using a <span className="text-book-dark font-bold">Demo Account</span>.
        </p>
      </div>

      <div className="bg-stone-50 dark:bg-stone-800 p-5 rounded-2xl mb-8 border border-stone-200 dark:border-book-border text-sm space-y-3">
        <div className="flex gap-3 text-book-dark font-bold items-start">
          <Info size={16} className="mt-1 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="dark:text-amber-400">You will see a pre-loaded collection of dummy threads.</p>
        </div>
        <div className="flex gap-3 text-book-dark font-bold items-start">
          <Info size={16} className="mt-1 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="dark:text-amber-400">Connection to the live backend server will be disabled.</p>
        </div>
        <div className="flex gap-3 text-book-dark font-bold items-start">
          <Info size={16} className="mt-1 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="dark:text-amber-400">New threads you create will not be saved permanently.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onProceed}
          className="w-full py-4 bg-book-dark dark:bg-book-accent text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
          I Understand, Proceed
        </button>
        <button
          onClick={onCancel}
          className="w-full py-4 bg-stone-100 dark:bg-stone-900 text-book-muted rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

// --- Authentication Screen ---

const AuthScreen = ({ onLoginSuccess, isDarkMode, toggleDarkMode }: {
  onLoginSuccess: (token: string, user: User) => void,
  isDarkMode: boolean,
  toggleDarkMode: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // null = checking, true = online, false = offline
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showPoof, setShowPoof] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await axios.get(`${BACKEND_API_URL}/Health`, { timeout: 3000 });
        setIsBackendOnline(true);
      } catch (err: any) {
        if (err.response) {
          // Server responded with something — it's online
          setIsBackendOnline(true);
        } else {
          // No response at all — network error, server truly down
          setIsBackendOnline(false);
        }
      }
    };
    checkHealth();

    const hasSeenHint = localStorage.getItem('hint_seen');
    if (!hasSeenHint) {
      setTimeout(() => setShowHint(true), 2000);
    }
  }, []);

  const triggerPoof = () => {
    setShowHint(false);
    setShowPoof(true);
    localStorage.setItem('hint_seen', 'true');
    setTimeout(() => setShowPoof(false), 800);
  };

  const handleToggleTheme = () => {
    if (showHint) triggerPoof();
    toggleDarkMode();
  };

  const customSmoothScroll = (element: HTMLElement, target: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const start = element.scrollTop;
      const change = target - start;
      const startTime = performance.now();
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        element.scrollTop = start + change * easeProgress;
        if (progress < 1) requestAnimationFrame(animateScroll);
        else resolve();
      };
      requestAnimationFrame(animateScroll);
    });
  };

  useEffect(() => {
    const startSequence = async () => {
      await new Promise(r => setTimeout(r, 1200));
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll <= 0) return;
        await customSmoothScroll(container, maxScroll, 1000);
        await new Promise(r => setTimeout(r, 1200));
        await customSmoothScroll(container, 0, 1000);
      }
    };
    startSequence();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    // Demo credentials shortcut
    if (formData.username === DEMO_CREDENTIALS.username && formData.password === DEMO_CREDENTIALS.password) {
      setShowDemoModal(true);
      return;
    }
    if (!isBackendOnline) {
      setError("Library server is offline. Use Demo Login.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === 'login' ? '/Auth/login' : '/Auth/register';
      const payload = activeTab === 'login'
        ? { usernameOrEmail: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };
      // FIX: Don't use axios.defaults — pass headers directly to avoid race conditions
      const response = await axios.post(`${BACKEND_API_URL}${endpoint}`, payload);
      if (response.data.token) {
        onLoginSuccess(response.data.token, response.data.user || MOCK_USER);
      } else {
        setError("Login failed: no token returned from server.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Bad request. Check your details.");
      } else {
        setError("Could not connect to server. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  const proceedWithDemo = () => {
    onLoginSuccess('demo-jwt-token', MOCK_USER);
  };

  return (
    <div ref={scrollContainerRef} className="fixed inset-0 bg-book-main dark:bg-stone-900 z-[200] flex items-center justify-center md:items-start p-4 md:p-8 overflow-y-auto font-sans theme-transition">
      <div className="fixed top-8 right-8 z-[500] flex flex-col items-end">
        <DarkModeToggle isDarkMode={isDarkMode} toggle={handleToggleTheme} />
        {showHint && <HintPopup onClose={triggerPoof} />}
        {showPoof && <PoofEffect />}
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-8">
          {[...Array(48)].map((_, i) => <BookOpen key={i} size={48} className="text-book-dark rotate-12" />)}
        </div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-stone-800 rounded-[2.5rem] shadow-2xl border border-book-border p-8 relative z-10 animate-fade-in-up md:mt-6 md:mb-12 theme-transition">
        {/* Backend status pill */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-book-card border border-book-border shadow-md z-20">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            isBackendOnline === null ? 'bg-stone-300 animate-pulse' :
            isBackendOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
            'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
          }`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-book-muted dark:text-book-dark">
            {isBackendOnline === null ? 'Connecting...' : isBackendOnline ? 'Library Online' : 'Library Offline'}
          </span>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-book-dark dark:bg-book-accent rounded-3xl text-white shadow-xl mb-6 hover:scale-110 transition-transform">
            <BookMarked size={40} />
          </div>
          <h1 className="font-display text-4xl font-black text-book-dark dark:text-book-main mb-2">Welcome Back</h1>
          <p className="text-book-muted dark:text-book-main/80 font-serif italic text-sm">Every book is a new conversation.</p>
        </div>

        {/* Login / Register tab switcher */}
        <div className="relative flex bg-book-sidebar dark:bg-stone-800 p-1.5 rounded-2xl mb-8 overflow-hidden theme-transition">
          <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-book-card rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${activeTab === 'login' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`} />
          <button
            disabled={!isBackendOnline}
            onClick={() => setActiveTab('login')}
            className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors duration-300 disabled:opacity-40 ${activeTab === 'login' ? 'text-book-dark' : 'text-book-muted'}`}
          >Login</button>
          <button
            disabled={!isBackendOnline}
            onClick={() => setActiveTab('register')}
            className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors duration-300 disabled:opacity-40 ${activeTab === 'register' ? 'text-book-dark' : 'text-book-muted'}`}
          >Register</button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative group">
            <UserInputIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-book-muted dark:text-book-main group-focus-within:text-book-dark" size={18} />
            <input
              name="username" placeholder="Username" required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-book-sidebar dark:bg-stone-800 border border-book-border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-book-dark/10 outline-none text-book-dark dark:text-book-main transition-all"
            />
          </div>
          {activeTab === 'register' && (
            <div className="relative animate-fade-in-up">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-book-muted" size={18} />
              <input
                name="email" type="email" placeholder="Email Address" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-book-sidebar dark:bg-stone-800 border border-book-border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-book-dark/10 outline-none text-book-dark dark:text-book-main transition-all"
              />
            </div>
          )}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-book-muted group-focus-within:text-book-dark" size={18} />
            <input
              name="password" type="password" placeholder="Password" required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-book-sidebar dark:bg-stone-800 border border-book-border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-book-dark/10 outline-none text-book-dark dark:text-book-main transition-all"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-pulse">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <span className="uppercase tracking-widest">{activeTab === 'login' ? 'Enter Library' : 'Create Account'}</span>
            }
          </Button>
        </form>

        {/* Demo login section */}
        <div className="mt-8 pt-8 border-t border-book-border">
          <p className="text-[10px] font-black uppercase text-book-muted tracking-[0.2em] mb-4 text-center">Looking To Demo The App?</p>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-800/30 text-left relative group hover:border-amber-300 transition-colors">
            <Sparkles className="absolute top-2 right-2 text-amber-500 opacity-30 group-hover:opacity-100 transition-opacity" size={20} />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-amber-800 dark:text-amber-500">Username</span>
                <span className="text-xs font-mono font-bold text-book-dark dark:text-book-main">{DEMO_CREDENTIALS.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-amber-800 dark:text-amber-500">Password</span>
                <span className="text-xs font-mono font-bold text-book-dark dark:text-book-main">{DEMO_CREDENTIALS.password}</span>
              </div>
            </div>
            <button
              onClick={() => setFormData({ username: DEMO_CREDENTIALS.username, email: '', password: DEMO_CREDENTIALS.password })}
              className="mt-3 w-full py-2 bg-white dark:bg-stone-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-stone-700 transition-colors"
            >
              Auto-fill Demo Details
            </button>
          </div>
        </div>
      </div>

      {showDemoModal && (
        <DemoWarningModal
          onProceed={proceedWithDemo}
          onCancel={() => setShowDemoModal(false)}
        />
      )}
    </div>
  );
};

// --- Core UI Components ---

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, type = "button" }: any) => {
  const variants: any = {
    primary: "bg-book-dark dark:bg-book-accent text-white hover:opacity-90 active:scale-95",
    secondary: "bg-book-card dark:bg-stone-800 text-book-dark hover:bg-book-border active:scale-95",
    outline: "border border-book-border text-book-muted hover:bg-book-sidebar dark:hover:bg-stone-800 active:scale-95"
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed theme-transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const PostCard = ({ thread, onClick }: { thread: Thread, onClick: () => void }) => {
  const { threadType, content, user, book, isSpoiler } = thread;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      onClick={onClick}
      className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm  border border-book-accent hover:border-book-border/30 hover:shadow-md transition-all cursor-pointer group mb-4 animate-fade-in-up theme-transition"
    >
      {children}
    </div>
  );

  switch (threadType) {
    case ThreadType.Quote:
      return (
        <CardWrapper>
          <div className="flex gap-4">
            <span className="font-display text-5xl text-book-accent opacity-30 leading-none">"</span>
            <div className="flex-1">
              <p className="font-serif text-lg leading-relaxed text-book-dark mb-4 dark:text-book-main italic">
                {isSpoiler ? <span className="blur-sm select-none bg-book-card dark:bg-stone-800 px-2">Spoiler content</span> : content}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-book-border/50">
                <div>
                  <span className="text-sm font-bold text-book-dark dark:text-book-main block">{book?.title || 'Unknown Book'}</span>
                  <span className="text-[10px] text-book-muted dark:text-book-main font-bold uppercase tracking-widest">{book?.author || 'Unknown Author'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-book-muted dark:text-book-main font-bold">@{user?.username}</span>
                  <img src={user?.avatarLink || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.id}`} className="w-8 h-8 rounded-full shadow-sm ring-1 ring-book-border" alt="avatar" />
                </div>
              </div>
            </div>
          </div>
        </CardWrapper>
      );
    case ThreadType.Progress:
      return (
        <CardWrapper>
          <div className="flex gap-6 items-center">
            <div className="w-20 flex-shrink-0 shadow-lg rotate-1 group-hover:rotate-0 transition-transform">
              <img src={book?.thumbnail || book?.imageUrl || 'https://via.placeholder.com/150'} className="rounded-md w-full h-full object-cover" alt="cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-bold text-xl mb-3 text-book-dark dark:text-book-main">{book?.title}</h3>
              <div className="flex items-center gap-4 mb-1">
                <div className="flex-1 h-2 bg-book-border dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${thread.progressPercentage || 42}%` }}></div>
                </div>
                <span className="text-xs font-bold text-book-muted dark:text-book-main">{thread.progressPercentage || 42}%</span>
              </div>
              <p className="text-sm text-book-muted dark:text-book-main font-serif italic">"{content.substring(0, 80)}..."</p>
            </div>
          </div>
        </CardWrapper>
      );
    case ThreadType.Review:
      return (
        <CardWrapper>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-book-border dark:bg-stone-800 flex items-center justify-center text-book-accent shadow-inner">
              <Star size={20} fill="currentColor" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase font-black tracking-widest text-book-muted dark:text-book-main">Review</span>
                {isSpoiler && <span className="bg-book-dark dark:bg-book-accent text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Spoiler Alert</span>}
              </div>
              <p className="text-book-dark leading-relaxed mb-4 font-serif text-lg dark:text-book-main">{content}</p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-sm font-serif italic text-book-accent  dark:text-book-main block">{book?.title}</span>
                  <span className="text-[10px] text-book-muted dark:text-book-main uppercase font-bold tracking-widest">{book?.author}</span>
                </div>
                <span className="text-xs text-book-muted dark:text-book-main  font-bold">by @{user?.username}</span>
              </div>
            </div>
          </div>
        </CardWrapper>
      );
    default:
      return (
        <CardWrapper>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-book-muted dark:text-book-main bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">Thought</span>
            <img src={user?.avatarLink || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.id}`} className="w-8 h-8 rounded-full shadow-sm border border-book-border" alt="avatar" />
          </div>
          <p className="text-lg text-book-dark dark:text-book-main font-serif leading-relaxed mb-6">{content}</p>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-book-muted dark:text-book-main">
            <span>@{user?.username}</span>
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
        </CardWrapper>
      );
  }
};

// --- Create Post Modal ---

const CreatePostModal = ({ isOpen, onClose, onRefresh, token }: {
  isOpen: boolean,
  onClose: () => void,
  onRefresh: () => void,
  token: string | null
}) => {
  const [content, setContent] = useState("");
  const [threadType, setThreadType] = useState(0);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent("");
      setSelectedBook(null);
      setSearchQuery("");
      setThreadType(0);
      setIsSpoiler(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length > 2) {
        setIsSearching(true);
        try {
          const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(trimmedQuery)}`);
          setSearchResults(res.data.docs.slice(0, 5));
        } catch (err: any) {
          console.error("OpenLibrary Search Error:", err.response?.status, err.message);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectBook = async (book: any) => {
    try {
      const response = await axios.get(`https://openlibrary.org${book.key}/editions.json`);
      const edition = response.data.entries.find((e: any) => e.isbn_13?.length > 0 || e.isbn_10?.length > 0);
      if (!edition) {
        alert("This edition lacks an ISBN. Try searching for a different version.");
        return;
      }
      const isbn = edition.isbn_13?.[0] || edition.isbn_10?.[0];

      // Collect all available fields from the OpenLibrary search result
      setSelectedBook({
        isbn,
        title: book.title || null,
        author: book.author_name?.[0] || null,
        cover: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
        // Optional fields — may or may not be present on the search result
        subtitle:       book.subtitle || null,
        publisher:      book.publisher?.[0] || null,
        publishedDate:  book.first_publish_year?.toString() || null,
        description:    book.first_sentence?.value || null,
        pageCount:      book.number_of_pages_median || null,
        language:       book.language?.[0] || null,
        previewLink:    book.key ? `https://openlibrary.org${book.key}` : null,
      });
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      console.error("Edition fetch error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !content) return;
    setIsSubmitting(true);

    // Demo mode — skip all API calls
    if (isDemoToken(token)) {
      onRefresh();
      onClose();
      setIsSubmitting(false);
      return;
    }

    try {
      const headers = getAuthHeaders(token);

      // Step 1: Check if book already exists in the database
      try {
        await axios.get(`${BACKEND_API_URL}/Books/${selectedBook.isbn}`, { headers });
      } catch (bookErr: any) {
        if (bookErr.response?.status === 404) {
          // Step 2: Book doesn't exist — create it with all available fields
          await axios.post(
            `${BACKEND_API_URL}/Books`,
            {
              Isbn:          selectedBook.isbn,
              Title:         selectedBook.title,
              Subtitle:      selectedBook.subtitle      || null,
              Publisher:     selectedBook.publisher     || null,
              PublishedDate: selectedBook.publishedDate || null,
              Description:   selectedBook.description   || null,
              PageCount:     selectedBook.pageCount     || null,
              Language:      selectedBook.language      || null,
              PreviewLink:   selectedBook.previewLink   || null,
              Thumbnail:     selectedBook.cover         || null,
            },
            { headers }
          );
        } else {
          // Any other error (network, 500, etc.) — bubble up to outer catch
          throw bookErr;
        }
      }

      // Step 3: Book is guaranteed to exist now — post the thread
      await axios.post(
        `${BACKEND_API_URL}/Threads`,
        {
          Content:    content,
          ThreadType: threadType,
          IsSpoiler:  isSpoiler,
          UserId:     JSON.parse(localStorage.getItem('bookthread_user')).id,
          BookISBN:   selectedBook.isbn,
        },
        { headers }
      );

      setContent("");
      setSelectedBook(null);
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Thread creation failed (Is your backend at :5164 running?):", err);
      alert("Could not publish thread. Is the backend running?");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-book-dark/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-book-main dark:bg-book-dark w-full max-w-xl rounded-3xl p-8 shadow-2xl relative animate-fade-in-up border border-book-border theme-transition">
        <button onClick={onClose} className="absolute top-6 right-6 text-book-muted hover:text-book-dark"><X size={24} /></button>
        <h2 className="font-serif text-2xl font-black mb-6 text-book-main">Create New Thread</h2>

        {/* Thread type selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {["Quote", "Progress", "Review", "Thought"].map((label, idx) => (
            <button
              key={label}
              onClick={() => setThreadType(idx)}
              className={`px-6 py-2 rounded-full font-serif text-sm transition-all whitespace-nowrap ${threadType === idx ? 'bg-book-dark dark:bg-book-accent text-white shadow-md' : 'bg-book-card dark:bg-stone-800 text-book-muted border border-book-border'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Book search */}
        <div className="relative mb-4">
          <input
            placeholder="Search book title or author..."
            className="w-full bg-book-card dark:bg-stone-800 border border-book-border rounded-xl p-4 pl-12 focus:ring-2 focus:ring-book-accent/20 outline-none transition-all text-book-dark dark:text-book-main"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-book-muted dark:text-book-main" size={20} />
          {isSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-2 border-book-muted border-t-book-dark"></div>}

          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-book-card border border-book-border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto ring-1 ring-book-dark/5">
              {searchResults.map((book) => (
                <div
                  key={book.key}
                  onClick={() => handleSelectBook(book)}
                  className="p-4 hover:bg-book-sidebar dark:hover:bg-stone-800 cursor-pointer border-b border-book-border last:border-0 flex flex-col"
                >
                  <span className="font-bold text-book-dark">{book.title}</span>
                  <span className="text-xs text-book-muted">by {book.author_name?.[0]} ({book.first_publish_year})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedBook && (
          <div className="flex gap-4 p-4 bg-book-sidebar dark:bg-stone-800 rounded-xl border border-book-border mb-4 animate-fade-in-up">
            <img src={selectedBook.cover} className="w-16 rounded shadow-lg" alt="selected cover" />
            <div>
              <h4 className="font-bold text-book-dark dark:text-book-main">{selectedBook.title}</h4>
              <p className="text-xs text-book-muted dark:text-book-main">{selectedBook.author}</p>
            </div>
          </div>
        )}

        <textarea
          placeholder="What's on your mind?"
          className="w-full bg-book-card dark:bg-stone-800 border border-book-border rounded-xl p-4 min-h-[140px] focus:ring-2 focus:ring-book-accent/20 outline-none resize-none mb-6 font-serif text-lg leading-relaxed text-book-dark dark:text-book-main"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-3 cursor-pointer text-book-muted font-bold text-xs uppercase tracking-widest">
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
              className="w-5 h-5 rounded border-book-border accent-book-dark focus:ring-0"
            />
            Contains Spoiler?
          </label>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={isSubmitting || !selectedBook || !content} onClick={handleSubmit}>
              {isSubmitting ? 'Publishing...' : 'Publish Thread'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Thread Details ---

const ThreadDetails = ({ user,  threadId, onBack, token }: { user: User, threadId: number, onBack: () => void, token: string | null }) => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchThread = useCallback(async () => {
    // FIX: Demo mode — just use dummy data, no real API call
    if (isDemoToken(token)) {
      const dummy = DUMMY_THREADS.find(t => t.id === threadId);
      setThread(dummy || null);
      setLoading(false);
      return;
    }
    try {
      // FIX: Pass auth header directly
      const res = await axios.get(`${BACKEND_API_URL}/Threads/${threadId}`, {
        headers: getAuthHeaders(token)
      });
      setThread(res.data);
    } catch (e) {
      const dummy = DUMMY_THREADS.find(t => t.id === threadId);
      if (dummy) setThread(dummy);
    } finally {
      setLoading(false);
    }
  }, [threadId, token]);

  useEffect(() => { fetchThread(); }, [fetchThread]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // FIX: Demo mode — optimistically add comment locally
    if (isDemoToken(token)) {
      setThread(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), {
          id: Date.now().toString(),
          content: commentText,
          userId: MOCK_USER.id,
          user: MOCK_USER,
          createdAt: new Date().toISOString()
        }]
      } : null);
      setCommentText("");
      return;
    }

    try {
      // FIX: Pass auth header directly
      await axios.post(
        `${BACKEND_API_URL}/Threads/comment`,
        {  content: commentText, userId: JSON.parse(localStorage.getItem('bookthread_user')).id, threadId: threadId },
        { headers: getAuthHeaders(token) }
      );
      setCommentText("");
      fetchThread();
    } catch (e) {
      // Optimistic fallback
      setThread(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), {
          id: Date.now().toString(),
          content: commentText,
          userId: MOCK_USER.id,
          user: MOCK_USER,
          createdAt: new Date().toISOString()
        }]
      } : null);
      setCommentText("");
    }
  };

  if (loading) return <div className="p-12 text-center text-book-muted animate-pulse font-serif italic">Turning pages...</div>;
  if (!thread) return <div className="p-12 text-center text-book-muted font-serif">Discussion not found.</div>;

  return (
    <div className="w-full animate-fade-in-up flex flex-col h-full bg-book-main dark:bg-stone-900 theme-transition">
      <header className="sticky top-0 bg-book-main/90 dark:bg-stone-900/90 backdrop-blur-md p-6 border-b border-book-border z-10 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-book-card dark:hover:bg-stone-800 rounded-full transition-all text-book-muted hover:text-book-dark"><X size={20} /></button>
        <h1 className="font-serif text-2xl font-black text-book-dark">Discussion</h1>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
        <PostCard thread={thread} onClick={() => {}} />

        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-book-muted mb-8 px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-book-border">
          <span className="flex items-center gap-2"><Heart size={14} className="text-red-400" /> {thread.likesCount || 0} Likes</span>
          <span className="flex items-center gap-2"><MessageCircle size={14} className="text-emerald-500" /> {thread.comments?.length || 0} Comments</span>
        </div>

        <div className="space-y-4 mb-32">{console.log(thread)}
          {thread.comments?.map((comment, i) => (
            <div key={comment.id} className="bg-white dark:bg-book-card p-4 rounded-2xl border border-book-border flex gap-4 animate-fade-in-up shadow-sm theme-transition" style={{ animationDelay: `${i * 0.1}s` }}>
              <img src={comment.user?.avatarLink || `https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.userId}`} className="w-10 h-10 rounded-full shadow-sm border border-book-border" alt="avatar" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-sm text-book-dark">@{comment.user?.username || 'Reader'}</span>
                  <span className="text-[10px] text-book-muted uppercase font-bold tracking-tighter">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-book-dark leading-relaxed font-serif">{comment.content}</p>
              </div>
            </div>
          ))}
          {(!thread.comments || thread.comments.length === 0) && (
            <div className="text-center py-12">
              <MessageCircle size={32} className="mx-auto text-book-border mb-3 opacity-30" />
              <p className="text-book-muted italic font-serif">Be the first to share a thought in this circle.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed comment input */}
      <div className="p-6 border-t border-book-border bg-book-main/95 dark:bg-stone-900/95 backdrop-blur-sm sticky bottom-0">
        <form onSubmit={handlePostComment} className="flex items-center gap-3">
          <img src={user.avatarLink} className="w-10 h-10 rounded-full border-2 border-book-border shadow-sm" alt="me" />
          <div className="flex-1 relative">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Contribute to the conversation..."
              className="w-full bg-white dark:bg-book-card border border-book-border rounded-2xl py-3 px-4 focus:ring-4 focus:ring-book-dark/5 outline-none transition-all pr-12 text-sm font-serif text-book-dark"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-book-dark disabled:opacity-20 hover:scale-110 transition-transform p-1"
            >
              <LogIn size={20} className="rotate-90" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Right Sidebar Widgets ---

const ReadingChallenge = () => (
  <div className="bg-book-dark dark:bg-stone-800 p-6 rounded-3xl mb-8 text-white shadow-xl relative overflow-hidden group theme-transition">
    <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-4 -mt-4 blur-2xl group-hover:bg-white/10 transition-colors"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">2024 Challenge</span>
        <Medal size={20} className="text-yellow-400" />
      </div>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="font-display text-4xl font-black">12</span>
        <span className="text-sm opacity-60">/ 20 Books</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white w-[60%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
      </div>
      <p className="text-[10px] mt-3 opacity-80 italic font-serif">"You're 2 books ahead of schedule!"</p>
    </div>
  </div>
);

const CurrentlyReading = () => (
  <div className="bg-white dark:bg-book-card/80  p-6 rounded-3xl mb-8 border border-book-border shadow-sm theme-transition">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-serif font-black text-book-dark">Currently Reading</h3>
      <BookOpen size={16} className="text-book-accent dark:text-book-main" />
    </div>
    <div className="flex gap-4 mb-4">
      <img src="https://covers.openlibrary.org/b/isbn/9780439358071-M.jpg" className="w-16 rounded-md shadow-md object-cover" alt="cover" />
      <div className="flex-1">
        <h4 className="font-bold text-sm text-book-dark leading-tight mb-1">HP & The Order of the Phoenix</h4>
        <p className="text-[10px] text-book-muted uppercase tracking-widest mb-3">J.K. Rowling</p>
        <div className="h-1.5 bg-book-sidebar dark:bg-stone-800 rounded-full overflow-hidden">
          <div className="h-full bg-book-dark dark:bg-book-accent w-[65%]"></div>
        </div>
        <p className="text-[10px] text-right text-book-muted mt-1 font-mono">65%</p>
      </div>
    </div>
    <button className="w-full py-2 bg-book-sidebar dark:bg-stone-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-book-dark dark:text-book-main/80 hover:bg-book-border transition-colors">
      Update Progress
    </button>
  </div>
);

const Recommendations = () => {
  const [recs, setRecs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: "List 2 short book recommendations for someone who loves 'Modern Classics'. Return two lines: Title - One sentence description.",
      });
      setRecs(response.text?.split('\n').filter(l => l.trim()).slice(0, 2) || []);
    } catch (e) {
      setRecs(["AI recommendations temporarily unavailable."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-book-card dark:bg-stone-800 border border-book-border p-6 rounded-3xl mb-6 shadow-sm theme-transition">
      <div className="flex items-center gap-2 text-book-dark dark:text-book-main/80 font-black mb-4">
        <Sparkles size={20} className="text-amber-500 dark:text-book-main/80" />
        AI Book Buddy
      </div>
      <div className="space-y-4 mb-4">
        {recs.length > 0
          ? recs.map((r, i) => <p key={i} className="text-xs text-book-muted dark:text-book-main/80 italic font-serif leading-relaxed">"{r}"</p>)
          : <p className="text-[10px] text-book-muted dark:text-book-main/80 text-center py-4">Your personalized shelf awaits...</p>
        }
      </div>
      <Button variant="outline" className="w-full text-[10px] uppercase tracking-widest font-black" onClick={fetchRecs} disabled={loading}>
        {loading ? 'Thinking...' : 'Get Curated Suggestions'}
      </Button>
    </div>
  );
};


const ThreadTypeBadge = ({ type }: { type: ThreadType }) => {
  const map: Record<ThreadType, string> = {
    [ThreadType.Quote]:    '❝ Quote',
    [ThreadType.Progress]: '◎ Progress',
    [ThreadType.Review]:   '★ Review',
    [ThreadType.Thought]:  '✦ Thought',
  };
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-book-muted bg-book-card dark:bg-stone-800 px-2 py-0.5 rounded-md mb-2">
      {map[type]}
    </span>
  );
};

const ProfileThreadCard = ({ thread }: { thread: Thread }) => (
  <div className="bg-book-card dark:bg-stone-800 border border-book-accent hover:border-book-border/30 rounded-2xl p-5 mb-3 transition-all cursor-pointer group">
    <ThreadTypeBadge type={thread.threadType} />
    <p className="font-serif text-sm leading-relaxed text-book-dark dark:text-stone-100 mb-3 italic line-clamp-3">{thread.content}</p>
    {thread.book && (
      <p className="text-[11px] font-bold text-book-accent mb-3">{thread.book.title}{thread.book.author ? ` · ${thread.book.author}` : ''}</p>
    )}
    {thread.threadType === ThreadType.Progress && thread.progressPercentage !== undefined && (
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-1.5 bg-book-border dark:bg-stone-700 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${thread.progressPercentage}%` }} />
        </div>
        <span className="text-[10px] font-bold text-book-muted">{thread.progressPercentage}%</span>
      </div>
    )}
    <div className="flex items-center justify-between pt-3 border-t border-book-border dark:border-stone-700">
      <div className="flex gap-4">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-book-muted"><Heart size={12} /> {thread.likesCount || 0}</span>
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-book-muted"><MessageCircle size={12} /> {thread.comments?.length || 0}</span>
      </div>
      <span className="text-[10px] text-book-muted">{new Date(thread.createdAt).toLocaleDateString()}</span>
    </div>
  </div>
);

const BookShelfSection = ({ label, books }: { label: string, books: UserBook[] }) => {
  if (books.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-book-muted">{label}</span>
        <div className="flex-1 h-px bg-book-border dark:bg-stone-700" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {books.map(ub => (
          <div key={ub.bookISBN} className="group cursor-pointer">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-book-card dark:bg-stone-800 mb-2 shadow-md group-hover:-translate-y-1 group-hover:-rotate-1 transition-transform duration-200">
              {ub.book?.thumbnail
                ? <img src={ub.book.thumbnail} className="w-full h-full object-cover" alt={ub.book.title} />
                : <div className="w-full h-full flex items-center justify-center"><BookOpen size={24} className="text-book-muted opacity-30" /></div>
              }
            </div>
            {ub.status === 'reading' && ub.progress !== undefined && (
              <div className="h-1 bg-book-border dark:bg-stone-700 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-book-accent rounded-full" style={{ width: `${ub.progress}%` }} />
              </div>
            )}
            <p className="text-[10px] font-bold text-book-dark dark:text-stone-200 leading-tight truncate">{ub.book?.title}</p>
            <p className="text-[9px] text-book-muted truncate">{ub.book?.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AchievementBadge = ({ icon, name, desc, unlocked }: { icon: string, name: string, desc: string, unlocked: boolean }) => (
  <div className={`bg-white dark:bg-book-card border border-book-border rounded-2xl p-4 text-center transition-all ${unlocked ? 'hover:border-book-accent/40' : 'opacity-40 grayscale'}`}>
    <div className="text-2xl mb-2">{icon}</div>
    <p className="text-[11px] font-black text-book-dark dark:text-stone-200 mb-1">{name}</p>
    <p className="text-[10px] text-book-muted leading-tight">{desc}</p>
  </div>
);

const ProfilePage = ({ user, token }: { user: User | null, token: string | null }) => {
  const [activeTab, setActiveTab] = useState<'threads' | 'shelf' | 'stats'>('threads');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!user) return;
    if (isDemoToken(token)) {
      setThreads(DUMMY_PROFILE_THREADS);
      setUserBooks(DUMMY_USER_BOOKS);
      setLoading(false);
      return;
    }
    try {
      const headers = getAuthHeaders(token);
      const [threadsRes, booksRes] = await Promise.allSettled([
        axios.get(`${BACKEND_API_URL}/Threads`, { headers }),
        axios.get(`${BACKEND_API_URL}/UserBooks`, { headers }),
      ]);
      setThreads(threadsRes.status === 'fulfilled' ? threadsRes.value.data.filter((t: Thread) => t.userId === user.id) : DUMMY_PROFILE_THREADS);
      setUserBooks(booksRes.status === 'fulfilled' ? booksRes.value.data : DUMMY_USER_BOOKS);
    } catch {
      setThreads(DUMMY_PROFILE_THREADS);
      setUserBooks(DUMMY_USER_BOOKS);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => { fetchProfileData(); }, [fetchProfileData]);

  const reading = userBooks.filter(b => b.status === 'reading');
  const read    = userBooks.filter(b => b.status === 'read');
  const want    = userBooks.filter(b => b.status === 'want');

  if (!user) return <div className="p-12 text-center text-book-muted font-serif italic">No user loaded.</div>;

  return (
    <div className="w-full animate-fade-in-up flex flex-col bg-book-main dark:bg-stone-900 min-h-full theme-transition">

      <header className="sticky top-0 bg-book-main/90 dark:bg-stone-900/90 backdrop-blur-md p-6 border-b border-book-border z-10 flex items-center gap-4 theme-transition">
        <h2 className="font-serif text-2xl font-black text-book-dark dark:text-stone-100">Profile</h2>
      </header>

      {/* Banner + avatar */}
      <div className="relative">
        <div className="h-24 bg-book-card dark:bg-stone-800  border-book-border" />
        <div className="px-6 flex items-end justify-between -mt-11 mb-4">
          <img
            src={user.avatarLink || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`}
            className="w-20 h-20 rounded-full border-4 border-book-main dark:border-stone-900 shadow-lg bg-book-card"
            alt="avatar"
          />
          <button className="mb-1  px-5 py-2 border-2 border-book-dark dark:border-stone-400 rounded-full text-[11px] font-black uppercase tracking-widest  dark:text-stone-900 bg-book-main hover:bg-book-dark dark:hover:text-white hover:text-white dark:hover:bg-stone-800 transition-all flex items-center gap-2">
            <Edit3 size={13} /> Edit Profile
          </button>
        </div>
        <div className="px-6 pb-5">
          <h3 className="font-serif text-xl font-black text-book-dark dark:text-stone-100 mb-0.5">{user.username}</h3>
          <p className="text-[12px] text-book-muted italic mb-3">@{user.username}</p>
          {user.bio && <p className="text-sm font-serif text-book-dark dark:text-stone-300 leading-relaxed mb-4 max-w-lg">{user.bio}</p>}
          {/* Stats row */}
          <div className="grid grid-cols-4 divide-x divide-book-border dark:divide-stone-700 bg-white dark:bg-book-card border border-book-border rounded-2xl overflow-hidden">
            {[
              { label: 'Books Read', value: read.length    },
              { label: 'Threads',    value: threads.length },
              { label: 'Followers',  value: 0              },
              { label: 'Following',  value: 0              },
            ].map(stat => (
              <div key={stat.label} className="py-3 text-center hover:bg-book-card dark:hover:bg-stone-700 transition-colors cursor-pointer">
                <span className="block font-black text-xl text-book-dark dark:text-stone-900 leading-none">{stat.value}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-book-muted mt-1 block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] z-[9] flex border-b border-book-border bg-book-main/90 dark:bg-stone-900/90 backdrop-blur-md px-6 theme-transition">
        {(['threads', 'shelf', 'stats'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-book-dark dark:border-stone-300 text-book-dark dark:text-stone-100' : 'border-transparent text-book-muted hover:text-book-dark dark:hover:text-stone-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-book-card dark:bg-stone-800 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {activeTab === 'threads' && (
              threads.length > 0
                ? threads.map(t => <ProfileThreadCard key={t.id} thread={t} />)
                : <div className="py-20 text-center"><BookOpen size={48} className="mx-auto text-book-border mb-4 opacity-40" /><p className="text-book-muted italic font-serif">No threads yet.</p></div>
            )}

            {activeTab === 'shelf' && (
              <>
                <BookShelfSection label="Currently Reading" books={reading} />
                <BookShelfSection label="Read"              books={read}    />
                <BookShelfSection label="Want to Read"      books={want}    />
                {userBooks.length === 0 && <div className="py-20 text-center"><BookMarked size={48} className="mx-auto text-book-border mb-4 opacity-40" /><p className="text-book-muted italic font-serif">Your shelf is empty.</p></div>}
              </>
            )}

            {activeTab === 'stats' && (
              <>
                {/* Metric cards */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { label: 'Books This Year', value: read.length,    sub: `Goal: 20 · ${Math.round((read.length / 20) * 100)}% done` },
                    { label: 'Reading Streak',  value: 14,             sub: 'Days in a row'    },
                    { label: 'Total Threads',   value: threads.length, sub: 'Posts published'  },
                    { label: 'Books on Shelf',  value: userBooks.length, sub: 'Across all lists' },
                  ].map(card => (
                    <div key={card.label} className="bg-white dark:bg-book-card border border-book-border rounded-2xl p-4 theme-transition">
                      <p className="text-[10px] font-black uppercase tracking-widest text-book-muted mb-2">{card.label}</p>
                      <p className="font-black text-3xl leading-none text-book-dark dark:text-stone-100 mb-1">{card.value}</p>
                      <p className="text-[11px] text-book-muted">{card.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Reading challenge */}
                <div className="bg-book-dark dark:bg-stone-800 p-5 rounded-3xl mb-8 text-white relative overflow-hidden group theme-transition">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/10 transition-colors" />
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">2024 Reading Challenge</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">{read.length}</span>
                        <span className="text-sm opacity-60">/ 20 books</span>
                      </div>
                    </div>
                    <Medal size={32} className="text-yellow-400 opacity-80" />
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((read.length / 20) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] mt-3 opacity-60 italic font-serif">{read.length >= 20 ? 'Challenge complete!' : `${20 - read.length} books left to hit your goal`}</p>
                </div>

                {/* Streak */}
                <div className="bg-white dark:bg-book-card border border-book-border rounded-3xl p-5 mb-8 theme-transition">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-serif font-black text-book-dark dark:text-stone-100">Reading Streak</p>
                    <Flame size={20} className="text-orange-500" />
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl font-black text-4xl text-orange-600 leading-none">14</div>
                    <p className="text-xs font-bold text-book-dark dark:text-stone-300">Days keeping the story alive!</p>
                  </div>
                  <div className="flex justify-between gap-1">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full h-2 rounded-full ${i < 5 ? 'bg-orange-500' : 'bg-book-border dark:bg-stone-700'}`} />
                        <span className="text-[9px] text-book-muted font-bold">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-book-muted mb-4 flex items-center gap-3">
                  Achievements <span className="flex-1 h-px bg-book-border dark:bg-stone-700 block" />
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <AchievementBadge icon="📚" name="Bookworm"   desc="Read 10+ books"       unlocked={read.length >= 10} />
                  <AchievementBadge icon="🔥" name="On Fire"    desc="14-day streak"         unlocked={true} />
                  <AchievementBadge icon="✍️" name="Critic"     desc="Posted 10 reviews"     unlocked={threads.filter(t => t.threadType === ThreadType.Review).length >= 10} />
                  <AchievementBadge icon="🏆" name="Champion"   desc="Complete yearly goal"  unlocked={read.length >= 20} />
                  <AchievementBadge icon="🌟" name="Influencer" desc="500+ followers"        unlocked={false} />
                  <AchievementBadge icon="📖" name="Centurion"  desc="Read 100 books"        unlocked={read.length >= 100} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('bookthread_token'));
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('bookthread_user') || 'null'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');


  const [activeTab, setActiveTab] = useState('Feed');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem('theme', newVal ? 'dark' : 'light');
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const fetchThreads = useCallback(async () => {
    // FIX: Demo mode — skip real API call entirely
    if (isDemoToken(token)) {
      setThreads(DUMMY_THREADS);
      setBackendDown(false);
      setLoading(false);
      return;
    }
    try {
      // FIX: Pass auth header directly in the request, not via axios.defaults
      // This avoids the race condition where fetchThreads fires before the
      // useEffect that sets axios.defaults.headers has run.
      const res = await axios.get(`${BACKEND_API_URL}/Threads`, {
        headers: getAuthHeaders(token)
      });
      setThreads(res.data);
      setBackendDown(false);
    } catch (e: any) {
      console.error("Backend unavailable. Using dummy data.", e.message);
      setThreads(DUMMY_THREADS);
      setBackendDown(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchThreads();
    else setLoading(false);
  }, [token, fetchThreads]);

  const handleLoginSuccess = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bookthread_token', newToken);
    localStorage.setItem('bookthread_user', JSON.stringify(newUser));
    if (newUser.username === DEMO_CREDENTIALS.username) {
      localStorage.removeItem('hint_seen');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setThreads([]);
    setSelectedThreadId(null);
    localStorage.removeItem('bookthread_token');
    localStorage.removeItem('bookthread_user');
  };

  if (!token) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  const navItems = [
    { name: 'Feed', icon: Home },
    { name: 'Explore', icon: Compass },
    { name: 'My Library', icon: BookCopy },
    { name: 'Notifications', icon: Heart },
    { name: 'Profile', icon: UserIcon },
  ];

  return (
    <div className={`flex h-screen w-full animate-fade-in-up font-sans theme-transition`}>
      {/* Left Sidebar */}
      <aside className="w-72 bg-book-sidebar dark:bg-stone-800 p-8  flex flex-col justify-between overflow-y-auto theme-transition shadow-inner">
        <div>
          <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
            <div className="bg-book-dark dark:bg-book-accent p-2.5 rounded-2xl text-white shadow-xl group-hover:rotate-6 transition-transform">
              <BookOpen size={28} />
            </div>
            <h1 className="font-serif text-2xl font-black tracking-tight text-book-dark dark:text-book-main">BookThread</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map(item => (
              <button
              	disabled={item.name === "Explore" || item.name === "My Library" || item.name === "Notifications" ? true : false}
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSelectedThreadId(null);
                }}
                className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all relative group theme-transition ${activeTab === item.name ? 'bg-white dark:bg-stone-600 text-book-main/90 font-black shadow-md ' : ' hover:bg-white/50 dark:hover:bg-stone-700/50'} disabled:opacity-20 disabled:cursor-not-allowed`}>
                <div className="flex items-center gap-4 text-book-dark dark:text-book-main">
                  <item.icon size={20} className={activeTab === item.name ? '' : 'opacity-40'} />
                  <span className="text-md">{item.name}</span>
                </div>
                {activeTab === item.name && <ChevronRight size={14} className="opacity-40" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-8 border-t border-book-border flex flex-col gap-4">
          <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-3 rounded-2xl border border-book-border shadow-sm mb-2 theme-transition">
            <span className="text-[10px] font-black uppercase text-book-muted px-2">Night Mode</span>
            <DarkModeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} />
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-stone-900/50 p-3 rounded-2xl border border-book-border shadow-sm theme-transition">
            <div className="flex items-center gap-3">
              <img src={user?.avatarLink || MOCK_USER.avatarLink} className="w-10 h-10 rounded-full border-2 border-book-border shadow-sm" alt="me" />
              <div className="flex flex-col">
                <span className="text-xs font-black leading-none text-book-main-dark dark:text-book-main">@{user?.username}</span>
                <span className="text-[9px] text-book-muted font-bold uppercase tracking-widest mt-1">
                  {isDemoToken(token) ? 'Demo Mode' : 'Reader'}
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-book-muted hover:text-red-500 rounded-xl transition-all" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-stone-100 dark:bg-stone-900 flex justify-center overflow-y-auto scrollbar-hide relative theme-transition">
        <div className="w-full max-w-2xl bg-stone-100 dark:bg-stone-900 min-h-screen  flex flex-col theme-transition">
      
{selectedThreadId ? (
  <ThreadDetails user={user} threadId={selectedThreadId} onBack={() => setSelectedThreadId(null)} token={token} />
) : activeTab === 'Profile' ? (
  <ProfilePage user={user} token={token} />
) : (
  <>
    <header className="sticky top-0 bg-book-main/90 dark:bg-stone-900/90 backdrop-blur-md p-6 border-b border-book-border z-10 flex justify-between items-center theme-transition">
      <h2 className="font-serif text-2xl font-black text-book-dark dark:text-book-main">{activeTab}</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-book-dark dark:bg-book-accent text-white h-12 min-w-[48px] px-6 rounded-full flex items-center gap-2 hover:scale-105 shadow-xl transition-all"
      >
        <Plus size={24} />
        <span className="font-bold text-[10px] tracking-widest uppercase">New Thread</span>
      </button>
    </header>
              <div className="p-6">
                {backendDown && !isDemoToken(token) && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm">
                    <WifiOff size={18} />
                    <span>Local backend at <b>:5164</b> unreachable. Showing cached threads.</span>
                  </div>
                )}
                {isDemoToken(token) && (
                  <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-400 text-sm">
                    <ShieldAlert size={18} />
                    <span className="font-bold">Demo Mode — showing pre-loaded threads. Changes won't be saved.</span>
                  </div>
                )}

                <div className="relative mb-8">
                  <input
                    placeholder="Search library or thoughts..."
                    className="w-full bg-white dark:bg-book-card border border-book-border rounded-2xl py-4 pl-12 pr-4 outline-none text-sm transition-all shadow-sm theme-transition text-book-dark"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-book-muted" size={18} />
                </div>

                <div className="flex gap-4 mb-8">
                  <button className="text-sm font-black border-b-4 border-book-dark pb-1 text-book-dark">Latest</button>
                  <button className="text-sm font-bold text-book-muted pb-1 hover:text-book-dark transition-colors">Popular</button>
                  <button className="text-sm font-bold text-book-muted pb-1 hover:text-book-dark transition-colors">Following</button>
                </div>

                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-44 bg-book-card dark:bg-stone-800 rounded-3xl" />)}
                  </div>
                ) : threads.length > 0 ? (
                  threads.map(t => (
                    <PostCard key={t.id} thread={t} onClick={() => setSelectedThreadId(t.id)} />
                  ))
                ) : (
                  <div className="py-24 text-center">
                    <BookOpen size={64} className="mx-auto text-book-border mb-4" />
                    <p className="text-book-muted italic font-serif">The library is quiet... Start a conversation!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-96 bg-book-sidebar dark:bg-stone-900 p-8 border-l border-book-border overflow-y-auto theme-transition">
        <h2 className="font-serif text-2xl font-black mb-8 text-book-accent dark:text-book-dark">Reading Hub</h2>
        <CurrentlyReading />
        <ReadingChallenge />
        <Recommendations />

        <div className="bg-white dark:bg-book-card/80 p-6 rounded-3xl mb-8 border border-book-border shadow-sm theme-transition">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-black text-book-dark">Streak</h3>
            <Flame size={20} className="text-orange-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600 font-display text-4xl font-black">14</div>
            <span className="text-xs font-bold text-book-dark">Days keeping the story alive!</span>
          </div>
        </div>
      </aside>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchThreads}
        token={token}
      />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

