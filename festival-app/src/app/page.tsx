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

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

// --- DATA ---
const FESTIVALS: Festival[] = [
  {
    name: "Lost Lands",
    location: "Thornville, Ohio",
    date: "2026-09-18",
    image: "https://www.lostlandsfestival.com/wp-content/uploads/2026/01/Lost_Lands_2026_Logo_WithDatesandLocation_1000px.png",
    description: "The prehistoric paradise returns. 500,000 watts of bass and giant dinosaurs.",
    details: ["Camping: GA Car", "Entry: Thursday 12am", "Checklist|checklist", "Tickets|https://lostlands.frontgatetickets.com/event/7nuf54cayx3j1p90"]
  },
  {
    name: "EDC Orlando",
    location: "Orlando, Florida",
    date: "2026-11-06",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/sites/44/2025/11/17172609/edco_2026_mk_ps_fs_seo_1200x630_r01.jpg",
    description: "Under the Electric Sky. Three days of neon, carnival rides, and the best house and techno.",
    details: ["Hotel: Home2Suites", "Shuttle: Purple Line", "Checklist|checklist"]
  },
  {
    name: "Cyclops Cove 4",
    location: "Boca Raton, Florida",
    date: "2026-12-04",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/2026/01/21190300/BjPk34sanaF62djjVmwlSzWUelCf6j0xXHFlrmNo-972x597.png",
    description: "Subtronics brings the cyclops army back to the beach for a two-day takeover.",
    details: ["Location: Sunset Cove", "Entry: VIP", "Checklist|checklist"]
  }
];

const getAvatarUrl = (type: string) => {
  const seed = type === 'boy' ? 'Felix' : 'Aneka';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

// --- MAIN COMPONENT ---
export default function FestivalHub() {
  const [mounted, setMounted] = useState(false);
  const [selectedFest, setSelectedFest] = useState<Festival | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const [userName, setUserName] = useState("Guest");
  const [avatarType, setAvatarType] = useState("boy");

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);
    const savedName = localStorage.getItem('squad-user-name');
    const savedType = localStorage.getItem('squad-avatar-type');
    if (savedName) setUserName(savedName);
    if (savedType) setAvatarType(savedType);

    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const saveSettings = (name: string, type: string) => {
    setUserName(name);
    setAvatarType(type);
    localStorage.setItem('squad-user-name', name);
    localStorage.setItem('squad-avatar-type', type);
  };

  const currentPfp = getAvatarUrl(avatarType);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-10 pt-6 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">SQUAD HUB</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
              <p className="font-bold uppercase text-[9px] md:text-[10px] tracking-widest text-zinc-500">
                {isOnline ? `Live Sync • ${userName}` : `Survival Mode • ${userName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button onClick={() => setShowMessages(true)} className="h-11 md:h-12 px-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Messages</span>
            </button>
            <button onClick={() => setShowSettings(true)} className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden active:scale-95">
              <img src={currentPfp} className="w-8 h-8 md:w-9 md:h-9" alt="Profile" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FESTIVALS.map((fest) => (
            <FestivalCard key={fest.name} fest={fest} onOpen={() => setSelectedFest(fest)} currentUser={userName} currentPfp={currentPfp} />
          ))}
        </div>
      </div>

      <MessageWall isOpen={showMessages} onClose={() => setShowMessages(false)} userName={userName} userPfp={currentPfp} />

      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-4">
              <img src={currentPfp} className="w-24 h-24 rounded-full border-4 border-white/10 mx-auto" alt="Avatar" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Profile</h2>
            </div>
            <div className="space-y-6">
              <input type="text" value={userName} onChange={(e) => saveSettings(e.target.value, avatarType)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none focus:border-white/30" />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => saveSettings(userName, 'boy')} className={`p-4 rounded-2xl border-2 ${avatarType === 'boy' ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5'}`}>Boy</button>
                <button onClick={() => saveSettings(userName, 'girl')} className={`p-4 rounded-2xl border-2 ${avatarType === 'girl' ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5'}`}>Girl</button>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl active:scale-95">Done</button>
          </div>
        </div>
      )}

      {selectedFest && (
        <div className="fixed inset-0 z-[50] bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex-1 p-8 md:p-16 space-y-8">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 font-bold uppercase text-xs mb-8 hover:text-white transition-colors">← Close</button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <div className="grid grid-cols-1 gap-4 pt-4">
              {selectedFest.details.map((detail, i) => {
                const [label, link] = detail.includes('|') ? detail.split('|') : [detail, null];
                return <DetailItem key={i} label={label} link={link === 'checklist' ? null : link} isChecklist={link === 'checklist'} festName={selectedFest.name} />;
              })}
            </div>
          </div>
          <div className="w-full md:w-96 bg-zinc-950 border-l border-white/10 p-8 shadow-2xl">
            <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-2 text-white">The Squad</h3>
            <SquadList festivalName={selectedFest.name} />
          </div>
        </div>
      )}
    </main>
  );
}

// --- CHECKLIST & DETAIL COMPONENT ---
function DetailItem({ label, link, isChecklist, festName }: { label: string; link: string | null; isChecklist?: boolean; festName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`checklist-${festName}-${label}`);
      if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); return []; } }
    }
    return [];
  });
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (!inputValue.trim()) return;
    const newList = [...items, { id: Math.random().toString(36).substr(2, 9), text: inputValue, done: false }];
    setItems(newList);
    localStorage.setItem(`checklist-${festName}-${label}`, JSON.stringify(newList));
    setInputValue("");
  };

  const toggleItem = (id: string) => {
    const newList = items.map(it => it.id === id ? { ...it, done: !it.done } : it);
    setItems(newList);
    localStorage.setItem(`checklist-${festName}-${label}`, JSON.stringify(newList));
  };

  if (!link && !isChecklist) return <div className="p-5 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 flex justify-between items-center font-bold italic text-white uppercase text-xs tracking-widest">
        <span>{label}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-5 pt-0 animate-in slide-in-from-top-2 duration-200 space-y-4">
          {isChecklist && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} placeholder="Pack what?" className="flex-1 bg-white/10 border border-white/5 p-3 rounded-xl outline-none text-sm font-bold text-white" />
                <button onClick={addItem} className="bg-white text-black px-5 rounded-xl font-black">+</button>
              </div>
              <div className="space-y-2">
                {items.map(it => (
                  <div key={it.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className={`text-sm font-bold ${it.done ? 'line-through text-white/30' : 'text-white'}`}>{it.text}</span>
                    <button onClick={() => toggleItem(it.id)} className={`w-6 h-6 rounded-md border-2 ${it.done ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                      {it.done && <span className="text-black text-[10px] font-black">✓</span>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {link && <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-white text-black rounded-xl text-center text-[10px] font-black uppercase">Open Link ↗</a>}
        </div>
      )}
    </div>
  );
}

// --- MESSAGE WALL COMPONENT ---
function MessageWall({ isOpen, onClose, userName, userPfp }: { isOpen: boolean, onClose: () => void, userName: string, userPfp: string }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('squad-wall-cache');
      if (saved) { try { return JSON.parse(saved); } catch (e) { return []; } }
    }
    return [];
  });
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchMsgs = async () => {
      if (!navigator.onLine) return;
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(25);
      if (data) { setMessages(data as Message[]); localStorage.setItem('squad-wall-cache', JSON.stringify(data)); }
    };
    fetchMsgs();
    const channel = supabase.channel('live-wall').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: { new: Message }) => {
      setMessages(prev => { const up = [payload.new, ...prev]; localStorage.setItem('squad-wall-cache', JSON.stringify(up.slice(0, 25))); return up; });
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isOpen]);

  if (!isOpen) return null;

  const send = async () => {
    if (!newMessage.trim()) return;
    const msg = { id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString(), user_name: userName, user_pfp: userPfp, content: newMessage, type: 'status' };
    setMessages(prev => [msg, ...prev]);
    setNewMessage("");
    if (navigator.onLine) await supabase.from('messages').insert([{ user_name: userName, user_pfp: userPfp, content: msg.content, type: 'status' }]);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Squad Wall</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">Survival Mode Ready</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white active:scale-90 transition-all">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-4">
            <img src={m.user_pfp} className="w-10 h-10 rounded-full border border-white/10" alt="" />
            <div className="flex-1">
              <div className="flex gap-2 items-center mb-1 text-[10px] font-black uppercase text-white">
                <span>{m.user_name}</span>
                <span className="text-zinc-500">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl rounded-tl-none text-zinc-200 text-sm">{m.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-zinc-950 border-t border-white/10 pb-10">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Broadcast..." className="flex-1 bg-transparent px-4 py-2 outline-none font-bold text-sm text-white" />
          <button onClick={send} className="bg-white text-black px-8 py-2 rounded-full font-black uppercase text-[10px]">Post</button>
        </div>
      </div>
    </div>
  );
}

// --- SQUADLIST ---
function SquadList({ festivalName }: { festivalName: string }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  useEffect(() => {
    const f = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', festivalName);
      if (data) setAttendees(data as Attendee[]);
    };
    f();
    const ch = supabase.channel(`sq-${festivalName}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'squad', filter: `festival_name=eq.${festivalName}` }, (payload: { new: Attendee }) => setAttendees(p => [...p, payload.new])).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [festivalName]);
  return (
    <div className="space-y-4">
      {attendees.map((p, i) => (
        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <img src={p.user_pfp} className="w-10 h-10 rounded-full border border-black shadow-lg" alt="" />
          <span className="font-bold text-sm text-zinc-300">{p.user_name}</span>
        </div>
      ))}
    </div>
  );
}

// --- FESTIVALCARD ---
function FestivalCard({ fest, onOpen, currentUser, currentPfp }: { fest: Festival, onOpen: () => void, currentUser: string, currentPfp: string }) {
  const [isGoing, setIsGoing] = useState(false);
  const daysLeft = Math.max(0, Math.ceil((+new Date(fest.date) - +new Date()) / (1000 * 60 * 60 * 24)));
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', fest.name).eq('user_name', currentUser);
      if (data && data.length > 0) setIsGoing(true);
    };
    check();
  }, [fest.name, currentUser]);
  const join = async (e: React.MouseEvent) => {
    e.stopPropagation(); if (isGoing) return;
    const { error } = await supabase.from('squad').insert([{ festival_name: fest.name, user_name: currentUser, user_pfp: currentPfp }]);
    if (!error) setIsGoing(true);
  };
  return (
    <div onClick={onOpen} className="relative h-[320px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer transition-all active:scale-[0.98]">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{daysLeft} Days</span>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">{fest.location}</p>
      </div>
      <button onClick={join} className={`absolute z-20 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-2xl ${isGoing ? "bg-green-500 border-green-400 text-white" : "bg-white border-white text-black hover:scale-110"}`}>
        {isGoing ? "✓" : "+"}
      </button>
    </div>
  );
}