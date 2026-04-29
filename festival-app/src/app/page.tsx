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
  const [showSurvivalWall, setShowSurvivalWall] = useState(false);

  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem('squad-user-name') || "Guest";
    return "Guest";
  });

  const [avatarType, setAvatarType] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem('squad-avatar-type') || "boy";
    return "boy";
  });

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
        {/* RESPONSIVE HEADER */}
        <header className="mb-10 pt-6 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none text-white">SQUAD HUB</h1>
            <p className="text-zinc-500 font-bold mt-1 uppercase text-[9px] md:text-[10px] tracking-widest">
              Live Sync • Welcome, {userName}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* SURVIVAL WALL - Icon only on mobile */}
            <button
              onClick={() => setShowSurvivalWall(true)}
              className="h-11 md:h-12 px-3 md:px-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2 hover:bg-orange-500/20 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-orange-500">Survival Wall</span>
            </button>

            {/* MESSAGES ICON */}
            <button
              onClick={() => setShowMessages(true)}
              className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            {/* SHARE BUTTON */}
            <button
              onClick={async () => {
                const shareData = { title: 'SQUAD HUB', url: window.location.href };
                try {
                  if (navigator.share) await navigator.share(shareData);
                  else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link Copied!');
                  }
                } catch (err) { console.error('Share failed:', err); }
              }}
              className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
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

        <div className="space-y-8">
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

      {/* MODALS */}
      <MessageWall isOpen={showMessages} onClose={() => setShowMessages(false)} userName={userName} userPfp={currentPfp} />

      {showSettings && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-4">
              <img src={currentPfp} className="w-24 h-24 rounded-full border-4 border-white/10 mx-auto" alt="Avatar" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Profile Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Display Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => saveSettings(e.target.value, avatarType)}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none focus:border-white/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Choose Avatar</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => saveSettings(userName, 'boy')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${avatarType === 'boy' ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5 opacity-50'}`}>
                    <img src={getAvatarUrl('boy')} className="w-12 h-12" alt="Boy" />
                    <span className="text-[10px] font-bold uppercase">Boy</span>
                  </button>
                  <button onClick={() => saveSettings(userName, 'girl')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${avatarType === 'girl' ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5 opacity-50'}`}>
                    <img src={getAvatarUrl('girl')} className="w-12 h-12" alt="Girl" />
                    <span className="text-[10px] font-bold uppercase">Girl</span>
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all mt-4">Done</button>
          </div>
        </div>
      )}

      {showSurvivalWall && (
        <div className="fixed inset-0 z-[70] bg-zinc-950 p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="max-w-2xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <h2 className="text-3xl font-black italic tracking-tighter text-orange-500">SURVIVAL WALL</h2>
              <button onClick={() => setShowSurvivalWall(false)} className="text-white/50 font-bold uppercase text-xs">Close</button>
            </header>
            <div className="p-8 bg-orange-500/5 border border-orange-500/20 rounded-[2rem] text-center">
              <p className="text-orange-500 font-bold italic text-sm">Offline sync coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {selectedFest && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex-1 p-8 md:p-16 space-y-8">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 font-bold uppercase text-xs mb-8">← Close</button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <p className="text-xl text-white/70 max-w-xl">{selectedFest.description}</p>
            <div className="space-y-4 pt-8">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Festival Details</h3>
              <div className="grid grid-cols-1 gap-4">
                {selectedFest.details.map((detail, i) => {
                  const [label, link] = detail.includes('|') ? detail.split('|') : [detail, null];
                  return <DetailItem key={i} label={label} link={link} />;
                })}
              </div>
            </div>
          </div>
          <div className="w-full md:w-96 bg-zinc-950 border-l border-white/10 p-8">
            <h3 className="text-xl font-black uppercase mb-8 text-white">The Squad</h3>
            <SquadList festivalName={selectedFest.name} />
          </div>
        </div>
      )}
    </main>
  );
}

// --- SUB-COMPONENTS ---

function SquadList({ festivalName }: { festivalName: string }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', festivalName);
      if (data) setAttendees(data);
    };
    fetch();
    const channel = supabase.channel(`squad-${festivalName}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'squad', filter: `festival_name=eq.${festivalName}` },
        (payload) => setAttendees(prev => [...prev, payload.new as Attendee]))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [festivalName]);

  return (
    <div className="space-y-4">
      {attendees.map((person, i) => (
        <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
          <img src={person.user_pfp} className="w-12 h-12 rounded-full border-2 border-black" alt="" />
          <span className="font-bold text-white">{person.user_name}</span>
        </div>
      ))}
      {attendees.length === 0 && <p className="text-zinc-600 italic">No one locked in yet...</p>}
    </div>
  );
}

function FestivalCard({ fest, onOpen, currentUser, currentPfp }: { fest: Festival, onOpen: () => void, currentUser: string, currentPfp: string }) {
  const [isGoing, setIsGoing] = useState(false);

  const diff = +new Date(fest.date) - +new Date();
  const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  useEffect(() => {
    const checkStatus = async () => {
      if (!currentUser) return;
      const { data } = await supabase
        .from('squad')
        .select('*')
        .eq('festival_name', fest.name)
        .eq('user_name', currentUser);
      setIsGoing(data && data.length > 0 ? true : false);
    };
    checkStatus();
  }, [fest.name, currentUser]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGoing) return;
    const { error } = await supabase.from('squad').insert([{ festival_name: fest.name, user_name: currentUser, user_pfp: currentPfp }]);
    if (!error) setIsGoing(true);
  };

  return (
    <div onClick={onOpen} className="relative h-[300px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer transition-all active:scale-[0.98]">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-50 group-hover:opacity-70 transition-opacity" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] animate-pulse">{daysLeft} Days to go</span>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">{fest.location}</p>
      </div>
      <button onClick={handleJoin} className={`absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-2xl ${isGoing ? "bg-green-500 border-green-400 text-white" : "bg-white border-white text-black active:scale-90"}`}>
        {isGoing ? <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
      </button>
    </div>
  );
}

function DetailItem({ label, link }: { label: string; link: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!link) return <div className="p-4 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 transition-all">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center font-bold italic text-white">
        <span>{label}</span>
        <span className={`transition-transform duration-300 text-[10px] ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 animate-in slide-in-from-top-2 duration-200">
          <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-white text-black rounded-xl text-center text-xs font-black uppercase shadow-lg">Open Official Link ↗</a>
        </div>
      )}
    </div>
  );
}

function MessageWall({ isOpen, onClose, userName, userPfp }: { isOpen: boolean, onClose: () => void, userName: string, userPfp: string }) {
  // 1. Lazy Initializer: Grabs cache BEFORE the first render to prevent ESLint errors
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('squad-wall-cache');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  // 2. Monitor Connection Status
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  // 3. Main Sync Logic (Online Only)
  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      if (!navigator.onLine) return;
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(20);
      if (data) {
        setMessages(data as Message[]);
        localStorage.setItem('squad-wall-cache', JSON.stringify(data));
      }
    };

    fetchMessages();

    const channel = supabase.channel('live-wall')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => {
          const updated = [payload.new as Message, ...prev];
          localStorage.setItem('squad-wall-cache', JSON.stringify(updated.slice(0, 20)));
          return updated;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isOpen]);

  // 4. Send Message with Outbox Support
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const pendingMsg: Message = {
      id: Math.random().toString(36).substr(2, 9), // Fallback ID for offline tracking
      created_at: new Date().toISOString(),
      user_name: userName,
      user_pfp: userPfp,
      content: newMessage,
      type: 'status'
    };

    // Optimistic UI update
    setMessages(prev => [pendingMsg, ...prev]);
    setNewMessage("");

    if (!navigator.onLine) {
      const outbox = JSON.parse(localStorage.getItem('squad-outbox') || '[]');
      localStorage.setItem('squad-outbox', JSON.stringify([...outbox, pendingMsg]));
      return;
    }

    const { error } = await supabase.from('messages').insert([{
      user_name: userName,
      user_pfp: userPfp,
      content: newMessage,
      type: 'status'
    }]);

    if (error) {
      const outbox = JSON.parse(localStorage.getItem('squad-outbox') || '[]');
      localStorage.setItem('squad-outbox', JSON.stringify([...outbox, pendingMsg]));
    }
  };

  // 5. Background Sync: Auto-send when signal returns
  useEffect(() => {
    if (isOnline) {
      const processOutbox = async () => {
        const outbox = JSON.parse(localStorage.getItem('squad-outbox') || '[]');
        if (outbox.length === 0) return;

        for (const msg of outbox) {
          await supabase.from('messages').insert([{
            user_name: msg.user_name,
            user_pfp: msg.user_pfp,
            content: msg.content,
            type: 'status'
          }]);
        }
        localStorage.removeItem('squad-outbox');
      };
      processOutbox();
    }
  }, [isOnline]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white">SQUAD MESSAGES</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? 'text-green-500' : 'text-zinc-500'}`}>
              {isOnline ? 'Live Signal' : 'Offline Mode'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
            <img src={msg.user_pfp} className="w-10 h-10 rounded-full border border-white/10" alt="" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase tracking-tight text-white">{msg.user_name}</span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl rounded-tl-none text-sm font-medium leading-relaxed text-zinc-200">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-zinc-600 italic py-20">No pings yet.</p>}
      </div>

      <div className="p-6 bg-zinc-950 border-t border-white/10 pb-10">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10 focus-within:border-white/30 transition-all">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isOnline ? "Drop a pin or status..." : "Offline: Queuing message..."}
            className="flex-1 bg-transparent px-4 py-2 outline-none font-bold text-sm text-white"
          />
          <button onClick={sendMessage} className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
            {isOnline ? 'Send' : 'Queue'}
          </button>
        </div>
      </div>
    </div>
  );
}