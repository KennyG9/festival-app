"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE SETUP ---
const supabaseUrl = 'https://avnbzaskdrpyjtwvmlvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bmJ6YXNrZHJweWp0d3ZtbHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM2MDYsImV4cCI6MjA5Mjk2OTYwNn0.aKnSzoJR08jG8ayVzKjUKoWSqu4uo8tg3J3E9wKzdg4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- INTERFACES ---
interface Attendee {
  festival_name: string;
  user_name: string;
  user_pfp: string;
}

interface Festival {
  name: string;
  location: string;
  date: string;
  image: string;
  description: string;
  details: string[];
}

interface Message {
  id: string;
  created_at: string;
  user_name: string;
  user_pfp: string;
  content: string;
  type: string;
}

// --- DATA ---
const FESTIVALS: Festival[] = [
  {
    name: "Lost Lands",
    location: "Thornville, Ohio",
    date: "2026-09-18",
    image: "https://www.lostlandsfestival.com/wp-content/uploads/2026/01/Lost_Lands_2026_Logo_WithDatesandLocation_1000px.png",
    description: "The prehistoric paradise returns. 500,000 watts of bass and giant dinosaurs.",
    details: ["Camping: GA Car", "Entry: Thursday 12am", "Tickets|https://lostlands.frontgatetickets.com/event/7nuf54cayx3j1p90"]
  },
  {
    name: "EDC Orlando",
    location: "Orlando, Florida",
    date: "2026-11-06",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/sites/44/2025/11/17172609/edco_2026_mk_ps_fs_seo_1200x630_r01.jpg",
    description: "Under the Electric Sky. Three days of neon, carnival rides, and the best house and techno.",
    details: ["Hotel: Home2Suites", "Shuttle: Purple Line", "Vibe: PLUR / House"]
  },
  {
    name: "Cyclops Cove 4",
    location: "Boca Raton, Florida",
    date: "2026-12-04",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/2026/01/21190300/BjPk34sanaF62djjVmwlSzWUelCf6j0xXHFlrmNo-972x597.png",
    description: "Subtronics brings the cyclops army back to the beach for a two-day takeover.",
    details: ["Location: Sunset Cove", "Entry: VIP", "Vibe: Wonky / Experimental"]
  }
];

const getAvatarUrl = (type: string) => {
  const seed = type === 'boy' ? 'Felix' : 'Aneka';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

// --- MAIN COMPONENT ---
export default function FestivalHub() {
  const [selectedFest, setSelectedFest] = useState<Festival | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Lazy Init State to prevent ESLint "Double Render" errors
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem('squad-user-name') || "Guest";
    return "Guest";
  });

  const [avatarType, setAvatarType] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem('squad-avatar-type') || "boy";
    return "boy";
  });

  // Track Online Status
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const saveSettings = (name: string, type: string) => {
    setUserName(name);
    setAvatarType(type);
    localStorage.setItem('squad-user-name', name);
    localStorage.setItem('squad-avatar-type', type);
  };

  const currentPfp = getAvatarUrl(avatarType);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="p-6">
        <header className="mb-10 pt-6 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none text-white">SQUAD HUB</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
              <p className={`font-bold uppercase text-[9px] md:text-[10px] tracking-widest ${isOnline ? 'text-zinc-500' : 'text-orange-500'}`}>
                {isOnline ? `Live Sync • ${userName}` : `Survival Mode • ${userName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* MESSAGES ICON (This now triggers the Wall we built) */}
            <button
              onClick={() => setShowMessages(true)}
              className="h-11 md:h-12 px-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Messages</span>
            </button>

            {/* PROFILE */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden active:scale-90"
            >
              <img src={currentPfp} className="w-8 h-8 md:w-9 md:h-9" alt="Profile" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FESTIVALS.map((fest) => (
            <FestivalCard
              key={fest.name}
              fest={fest}
              onOpen={() => setSelectedFest(fest)}
              currentUser={userName}
              currentPfp={currentPfp}
            />
          ))}
        </div>
      </div>

      <MessageWall
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
        userName={userName}
        userPfp={currentPfp}
      />

      {showSettings && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8">
            <div className="text-center space-y-4">
              <img src={currentPfp} className="w-24 h-24 rounded-full border-4 border-white/10 mx-auto" alt="Avatar" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Profile</h2>
            </div>
            <div className="space-y-6">
              <input
                type="text"
                value={userName}
                onChange={(e) => saveSettings(e.target.value, avatarType)}
                placeholder="User Name"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => saveSettings(userName, 'boy')} className={`p-4 rounded-2xl border-2 ${avatarType === 'boy' ? 'border-green-500 bg-green-500/10' : 'border-white/10'}`}>
                  Boy
                </button>
                <button onClick={() => saveSettings(userName, 'girl')} className={`p-4 rounded-2xl border-2 ${avatarType === 'girl' ? 'border-green-500 bg-green-500/10' : 'border-white/10'}`}>
                  Girl
                </button>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl">Save</button>
          </div>
        </div>
      )}

      {selectedFest && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex-1 p-8 md:p-16 space-y-8">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 font-bold uppercase text-xs mb-8">← Close</button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <div className="grid grid-cols-1 gap-4">
              {selectedFest.details.map((detail, i) => {
                const [label, link] = detail.includes('|') ? detail.split('|') : [detail, null];
                return <DetailItem key={i} label={label} link={link} />;
              })}
            </div>
          </div>
          <div className="w-full md:w-96 bg-zinc-950 border-l border-white/10 p-8">
            <h3 className="text-xl font-black uppercase mb-8">The Squad</h3>
            <SquadList festivalName={selectedFest.name} />
          </div>
        </div>
      )}
    </main>
  );
}

// --- MESSAGE WALL COMPONENT ---
function MessageWall({ isOpen, onClose, userName, userPfp }: { isOpen: boolean, onClose: () => void, userName: string, userPfp: string }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('squad-wall-cache');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !navigator.onLine) return;
    const fetch = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(20);
      if (data) {
        setMessages(data as Message[]);
        localStorage.setItem('squad-wall-cache', JSON.stringify(data));
      }
    };
    fetch();
    const channel = supabase.channel('live-wall')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: { new: Message }) => { // <--- Defined the specific type here
          setMessages(prev => {
            const updated = [payload.new, ...prev];
            localStorage.setItem('squad-wall-cache', JSON.stringify(updated.slice(0, 20)));
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const msg = { id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString(), user_name: userName, user_pfp: userPfp, content: newMessage, type: 'status' };
    setMessages(prev => [msg, ...prev]);
    setNewMessage("");
    if (!navigator.onLine) {
      const outbox = JSON.parse(localStorage.getItem('squad-outbox') || '[]');
      localStorage.setItem('squad-outbox', JSON.stringify([...outbox, msg]));
      return;
    }
    await supabase.from('messages').insert([{ user_name: userName, user_pfp: userPfp, content: msg.content, type: 'status' }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950">
        <div>
          <h2 className="text-2xl font-black italic text-white">SQUAD MESSAGES</h2>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? 'text-green-500' : 'text-orange-500'}`}>
            {isOnline ? 'Live Signal' : 'Survival Mode (Offline)'}
          </p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4">
            <img src={msg.user_pfp} className="w-10 h-10 rounded-full border border-white/10" alt="" />
            <div className="flex-1">
              <div className="flex gap-2 items-center mb-1">
                <span className="font-black text-[10px] text-white">{msg.user_name}</span>
                <span className="text-[8px] text-zinc-500">{new Date(msg.created_at).toLocaleTimeString()}</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl rounded-tl-none text-sm text-zinc-200">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-zinc-950 border-t border-white/10 pb-10">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
          <input
            type="text" value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isOnline ? "Message squad..." : "Offline: Queue message..."}
            className="flex-1 bg-transparent px-4 py-2 outline-none font-bold text-sm text-white"
          />
          <button onClick={sendMessage} className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[10px]">
            {isOnline ? 'Send' : 'Queue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SQUAD & CARD SUB-COMPONENTS (Original logic maintained with TS fixes) ---
function SquadList({ festivalName }: { festivalName: string }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', festivalName);
      if (data) setAttendees(data);
    };
    fetch();
  }, [festivalName]);

  return (
    <div className="space-y-4">
      {attendees.map((person, i) => (
        <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
          <img src={person.user_pfp} className="w-12 h-12 rounded-full border-2 border-black" alt="" />
          <span className="font-bold text-white">{person.user_name}</span>
        </div>
      ))}
    </div>
  );
}

function FestivalCard({ fest, onOpen, currentUser, currentPfp }: { fest: Festival, onOpen: () => void, currentUser: string, currentPfp: string }) {
  const [isGoing, setIsGoing] = useState(false);
  const daysLeft = Math.max(0, Math.ceil((+new Date(fest.date) - +new Date()) / (1000 * 60 * 60 * 24)));

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGoing) return;
    const { error } = await supabase.from('squad').insert([{ festival_name: fest.name, user_name: currentUser, user_pfp: currentPfp }]);
    if (!error) setIsGoing(true);
  };

  return (
    <div onClick={onOpen} className="relative h-[300px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer active:scale-[0.98]">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-50 group-hover:opacity-70 transition-opacity" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-pulse">{daysLeft} Days to go</span>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">{fest.location}</p>
      </div>
      <button onClick={handleJoin} className={`absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${isGoing ? "bg-green-500 border-green-400" : "bg-white border-white text-black"}`}>
        {isGoing ? "✓" : "+"}
      </button>
    </div>
  );
}

function DetailItem({ label, link }: { label: string; link: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!link) return <div className="p-4 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center font-bold italic text-white">
        <span>{label}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-white text-black rounded-xl text-center text-xs font-black uppercase">Open Link ↗</a>
        </div>
      )}
    </div>
  );
}