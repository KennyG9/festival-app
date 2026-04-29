"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avnbzaskdrpyjtwvmlvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bmJ6YXNrZHJweWp0d3ZtbHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM2MDYsImV4cCI6MjA5Mjk2OTYwNn0.aKnSzoJR08jG8ayVzKjUKoWSqu4uo8tg3J3E9wKzdg4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- INTERFACES ---
interface UserProfile {
  name: string;
  avatarType: 'boy' | 'girl';
}

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
}

interface ChecklistItem {
  id: string;
  item_text: string;
  is_done: boolean;
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
    description: "Under the Electric Sky. Three days of neon and house/techno.",
    details: ["Hotel: Home2Suites", "Shuttle: Purple Line", "Checklist|checklist"]
  },
  {
    name: "Cyclops Cove 4",
    location: "Boca Raton, Florida",
    date: "2026-12-04",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/2026/01/21190300/BjPk34sanaF62djjVmwlSzWUelCf6j0xXHFlrmNo-972x597.png",
    description: "Subtronics brings the cyclops army back to the beach.",
    details: ["Location: Sunset Cove", "Entry: VIP", "Checklist|checklist"]
  }
];

const getAvatarUrl = (type: string, seed: string) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&flip=${type === 'girl'}`;

// --- MAIN HUB ---
export default function FestivalHub() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedFest, setSelectedFest] = useState<Festival | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [regName, setRegName] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
      setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
      const saved = localStorage.getItem('squad-profile');
      if (saved) setUser(JSON.parse(saved));
    });
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);

  const handleRegister = (avatarType: 'boy' | 'girl') => {
    if (!regName.trim()) return;
    const newProfile: UserProfile = { name: regName.trim(), avatarType };
    setUser(newProfile);
    localStorage.setItem('squad-profile', JSON.stringify(newProfile));
  };

  const deleteAccount = () => {
    localStorage.removeItem('squad-profile');
    window.location.reload();
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  // REGISTRATION SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl">
          <h1 className="text-4xl font-black italic tracking-tighter text-center">SQUAD HUB</h1>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-2">Display Name</p>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Enter name..."
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none focus:border-white/30 transition-all"
            />
          </div>
          <div className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${!regName.trim() ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <button onClick={() => handleRegister('boy')} className="p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-green-500 transition-all flex flex-col items-center gap-3">
              <img src={getAvatarUrl('boy', 'male')} className="w-12 h-12" alt="" />
              <span className="text-[10px] font-black uppercase">Male</span>
            </button>
            <button onClick={() => handleRegister('girl')} className="p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-green-500 transition-all flex flex-col items-center gap-3">
              <img src={getAvatarUrl('girl', 'female')} className="w-12 h-12" alt="" />
              <span className="text-[10px] font-black uppercase">Female</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-10 pt-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">SQUAD HUB</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
              <p className="font-bold uppercase text-[9px] text-zinc-500 tracking-widest">{user.name} • {isOnline ? 'CONNECTED' : 'DISCONNECTED'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowMessages(true)} className="h-12 px-4 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all text-[10px] font-black uppercase">Messages</button>
            <button onClick={() => setShowProfile(true)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden active:scale-95 transition-all">
              <img src={getAvatarUrl(user.avatarType, user.name)} className="w-8 h-8" alt="" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FESTIVALS.map((fest) => (
            <FestivalCard key={fest.name} fest={fest} onOpen={() => setSelectedFest(fest)} currentUser={user} />
          ))}
        </div>
      </div>

      <MessageWall isOpen={showMessages} onClose={() => setShowMessages(false)} user={user} />

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-4">
              <img src={getAvatarUrl(user.avatarType, user.name)} className="w-20 h-20 mx-auto rounded-full border-2 border-white/10" alt="" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">{user.name}</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{user.avatarType === 'boy' ? 'Male Profile' : 'Female Profile'}</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => setShowProfile(false)} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl active:scale-95 transition-all">Done</button>
              <button onClick={deleteAccount} className="w-full py-4 bg-red-600/10 border border-red-600/20 text-red-500 font-black uppercase rounded-2xl active:scale-95 transition-all text-[10px]">Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {selectedFest && (
        <div className="fixed inset-0 z-[50] bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex-1 p-8 md:p-16 space-y-8">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 font-bold uppercase text-xs mb-8 hover:text-white">← Close</button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <div className="grid grid-cols-1 gap-4 pt-4">
              {selectedFest.details.map((detail, i) => {
                const [label, link] = detail.includes('|') ? detail.split('|') : [detail, null];
                return <DetailItem key={i} label={label} link={link === 'checklist' ? null : link} isChecklist={link === 'checklist'} festName={selectedFest.name} user={user} />;
              })}
            </div>
          </div>
          <div className="w-full md:w-96 bg-zinc-950 border-l border-white/10 p-8 shadow-2xl">
            <h3 className="text-xl font-black uppercase mb-8 text-white">The Squad</h3>
            <SquadList festivalName={selectedFest.name} />
          </div>
        </div>
      )}
    </main>
  );
}

// --- CHECKLIST COMPONENT ---
function DetailItem({ label, link, isChecklist, festName, user }: { label: string; link: string | null; isChecklist?: boolean; festName: string, user: UserProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [input, setInput] = useState("");

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('checklist').select('*').eq('fest_name', festName).order('created_at', { ascending: true });
    if (data) setItems(data as ChecklistItem[]);
  }, [festName]);

  useEffect(() => {
    if (!isChecklist || !isOpen) return;
    const load = async () => { await fetchData(); };
    load();
    const ch = supabase.channel(`ck-${festName}`).on('postgres_changes', { event: '*', schema: 'public', table: 'checklist', filter: `fest_name=eq.${festName}` }, () => fetchData()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isChecklist, isOpen, festName, fetchData]);

  const add = async () => {
    if (!input.trim()) return;
    await supabase.from('checklist').insert([{ fest_name: festName, item_text: input, added_by: user.name }]);
    setInput("");
  };

  if (!link && !isChecklist) return <div className="p-5 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;

  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 flex justify-between items-center font-bold italic text-white uppercase text-xs">
        <span>{label}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-5 pt-0 space-y-4 animate-in fade-in duration-200">
          {isChecklist && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} className="flex-1 bg-white/10 p-3 rounded-xl text-white text-sm outline-none" placeholder="Add gear..." />
                <button onClick={add} className="bg-white text-black px-5 rounded-xl font-black">+</button>
              </div>
              <div className="space-y-2">
                {items.map(it => (
                  <div key={it.id} className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-white/5">
                    <span className={`text-sm font-bold ${it.is_done ? 'line-through text-white/20' : 'text-white'}`}>{it.item_text}</span>
                    <button onClick={async () => await supabase.from('checklist').update({ is_done: !it.is_done }).eq('id', it.id)} className={`w-6 h-6 rounded-md border-2 ${it.is_done ? 'bg-green-500 border-green-400' : 'border-white/20'}`}>{it.is_done && "✓"}</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {link && <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-white text-black rounded-xl text-center font-black uppercase text-[10px]">Open Link ↗</a>}
        </div>
      )}
    </div>
  );
}

// --- MESSAGES WALL ---
function MessageWall({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: UserProfile }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const fetchWall = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(25);
    if (data) setMessages(data as Message[]);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => { await fetchWall(); };
    load();
    const ch = supabase.channel('wall').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchWall()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isOpen, fetchWall]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950 shadow-xl">
        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Messages</h2>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-4">
            <img src={getAvatarUrl(user.avatarType, m.user_name)} className="w-10 h-10 rounded-full border border-white/10" alt="" />
            <div className="flex-1 p-4 bg-zinc-900 rounded-2xl rounded-tl-none border border-white/5 shadow-lg">
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{m.user_name}</p>
              <p className="text-white text-sm">{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-zinc-950 border-t border-white/10">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (async () => { if (!input.trim()) return; await supabase.from('messages').insert([{ user_name: user.name, content: input }]); setInput(""); })()} className="flex-1 bg-transparent px-4 py-2 text-white outline-none" placeholder="Message squad..." />
        </div>
      </div>
    </div>
  );
}

// --- CARDS & SQUAD ---
function FestivalCard({ fest, onOpen, currentUser }: { fest: Festival, onOpen: () => void, currentUser: UserProfile }) {
  const [isGoing, setIsGoing] = useState(false);
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', fest.name).eq('user_name', currentUser.name);
      if (data && data.length > 0) setIsGoing(true);
    };
    check();
  }, [fest.name, currentUser.name]);
  return (
    <div onClick={onOpen} className="relative h-[320px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer active:scale-[0.98] transition-all">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">{fest.location}</p>
      </div>
      <button onClick={async (e) => { e.stopPropagation(); if (isGoing) return; await supabase.from('squad').insert([{ festival_name: fest.name, user_name: currentUser.name, user_pfp: getAvatarUrl(currentUser.avatarType, currentUser.name) }]); setIsGoing(true); }} className={`absolute z-20 bottom-6 right-6 w-14 h-14 rounded-full border-2 transition-all shadow-xl ${isGoing ? "bg-green-500 border-green-400 text-white" : "bg-white text-black"}`}>{isGoing ? "✓" : "+"}</button>
    </div>
  );
}

function SquadList({ festivalName }: { festivalName: string }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  useEffect(() => {
    const f = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', festivalName);
      if (data) setAttendees(data as Attendee[]);
    };
    f();
  }, [festivalName]);
  return (
    <div className="space-y-4">
      {attendees.map((p, i) => (
        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-md">
          <img src={p.user_pfp} className="w-10 h-10 rounded-full border border-black shadow-lg" alt="" />
          <span className="font-bold text-sm text-zinc-300 tracking-tight">{p.user_name}</span>
        </div>
      ))}
    </div>
  );
}