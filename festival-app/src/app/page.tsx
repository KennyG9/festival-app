"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
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
  item_text: string;
  is_done: boolean;
  added_by: string;
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
    description: "Under the Electric Sky. Three days of neon, carnival rides, and house/techno vibes.",
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

// --- HELPER COMPONENT: SWIPE TO DELETE ---
function SwipeableItem({ children, onDelete }: { children: React.ReactNode, onDelete: () => void }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const onStart = (e: React.TouchEvent | React.MouseEvent) => {
    setStartX('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const onMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === 0) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = x - startX;
    if (diff < 0) setCurrentX(diff);
  };

  const onEnd = () => {
    if (currentX < -60) setCurrentX(-80);
    else setCurrentX(0);
    setStartX(0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-red-600">
      <button onClick={onDelete} className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center text-[10px] font-black uppercase text-white">Delete</button>
      <div
        className="relative bg-zinc-900 border border-white/5 p-3 flex justify-between items-center transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${currentX}px)` }}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
      >
        {children}
      </div>
    </div>
  );
}

// --- MAIN HUB ---
export default function FestivalHub() {
  const [mounted, setMounted] = useState(false);
  const [selectedFest, setSelectedFest] = useState<Festival | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [userName, setUserName] = useState("Guest");
  const [avatarType, setAvatarType] = useState("boy");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setIsOnline(navigator.onLine);
      const savedName = localStorage.getItem('squad-user-name');
      const savedType = localStorage.getItem('squad-avatar-type');
      if (savedName) setUserName(savedName);
      if (savedType) setAvatarType(savedType);
    }, 0);

    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const saveSettings = (name: string, type: string) => {
    setUserName(name); setAvatarType(type);
    localStorage.setItem('squad-user-name', name);
    localStorage.setItem('squad-avatar-type', type);
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-10 pt-6 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">SQUAD HUB</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
              <p className="font-bold uppercase text-[10px] tracking-widest text-zinc-500">{isOnline ? `Live Sync • ${userName}` : `Survival Mode • ${userName}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMessages(true)} className="h-12 px-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 active:scale-95 transition-all"><span className="text-[10px] font-black uppercase">Messages</span></button>
            <button onClick={() => setShowSettings(true)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden active:scale-95 transition-all">
              <img src={getAvatarUrl(avatarType)} className="w-9 h-9" alt="" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FESTIVALS.map((fest) => (
            <FestivalCard key={fest.name} fest={fest} onOpen={() => setSelectedFest(fest)} currentUser={userName} currentPfp={getAvatarUrl(avatarType)} />
          ))}
        </div>
      </div>

      <MessageWall isOpen={showMessages} onClose={() => setShowMessages(false)} userName={userName} userPfp={getAvatarUrl(avatarType)} />

      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center">Profile</h2>
            <input type="text" value={userName} onChange={(e) => saveSettings(e.target.value, avatarType)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none" />
            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl active:scale-95 transition-all">Done</button>
          </div>
        </div>
      )}

      {selectedFest && (
        <div className="fixed inset-0 z-[50] bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex-1 p-8 md:p-16 space-y-8 text-white">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 font-bold uppercase text-xs mb-8 hover:text-white transition-colors">← Close</button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <div className="grid grid-cols-1 gap-4 pt-4">
              {selectedFest.details.map((detail, i) => {
                const [label, link] = detail.includes('|') ? detail.split('|') : [detail, null];
                return <DetailItem key={i} label={label} link={link === 'checklist' ? null : link} isChecklist={link === 'checklist'} festName={selectedFest.name} userName={userName} />;
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

// --- SHARED CHECKLIST COMPONENT ---
function DetailItem({ label, link, isChecklist, festName, userName }: { label: string; link: string | null; isChecklist?: boolean; festName: string, userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  const fetchChecklist = useCallback(async () => {
    const { data } = await supabase.from('checklist').select('*').eq('fest_name', festName).order('created_at', { ascending: true });
    if (data) setItems(data as ChecklistItem[]);
  }, [festName]);

  useEffect(() => {
    if (!isChecklist || !isOpen) return;

    const timer = setTimeout(() => {
      fetchChecklist();
    }, 0);

    const channel = supabase.channel(`check-${festName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist', filter: `fest_name=eq.${festName}` }, () => fetchChecklist())
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [isChecklist, isOpen, festName, fetchChecklist]);

  const addItem = async () => {
    if (!inputValue.trim()) return;
    await supabase.from('checklist').insert([{ fest_name: festName, item_text: inputValue, added_by: userName }]);
    setInputValue("");
  };

  const toggleItem = async (item: ChecklistItem) => {
    await supabase.from('checklist').update({ is_done: !item.is_done }).eq('id', item.id);
  };

  const deleteItem = async (id: string) => {
    await supabase.from('checklist').delete().eq('id', id);
  };

  if (!link && !isChecklist) return <div className="p-5 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 flex justify-between items-center font-bold italic text-white uppercase text-xs">
        <span>{label}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="p-5 pt-0 space-y-4">
          {isChecklist && (
            <>
              <div className="flex gap-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} placeholder="Squad gear list..." className="flex-1 bg-white/10 p-3 rounded-xl outline-none text-white text-sm font-bold" />
                <button onClick={addItem} className="bg-white text-black px-5 rounded-xl font-black active:scale-90 transition-all">+</button>
              </div>
              <div className="space-y-2">
                {items.map(it => (
                  <SwipeableItem key={it.id} onDelete={() => deleteItem(it.id)}>
                    <span className={`text-sm font-bold ${it.is_done ? 'line-through text-white/30' : 'text-white'}`}>{it.item_text}</span>
                    <button onClick={() => toggleItem(it)} className={`w-6 h-6 rounded-md border-2 transition-all ${it.is_done ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                      {it.is_done && <span className="text-black text-[10px] font-black">✓</span>}
                    </button>
                  </SwipeableItem>
                ))}
              </div>
            </>
          )}
          {link && <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-white text-black rounded-xl text-center font-black uppercase text-[10px] active:scale-95 transition-all">Link ↗</a>}
        </div>
      )}
    </div>
  );
}

// --- MESSAGE WALL ---
function MessageWall({ isOpen, onClose, userName, userPfp }: { isOpen: boolean, onClose: () => void, userName: string, userPfp: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMsgs = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(25);
    if (data) setMessages(data as Message[]);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      fetchMsgs();
    }, 0);

    const ch = supabase.channel('live-wall').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchMsgs()).subscribe();
    return () => {
      clearTimeout(timer);
      supabase.removeChannel(ch);
    };
  }, [isOpen, fetchMsgs]);

  if (!isOpen) return null;

  const send = async () => {
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert([{ user_name: userName, user_pfp: userPfp, content: newMessage, type: 'status' }]);
    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950 shadow-xl">
        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Squad Wall</h2>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 font-bold text-white active:scale-90 transition-all">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-4">
            <img src={m.user_pfp} className="w-10 h-10 rounded-full border border-white/10" alt="" />
            <div className="flex-1 p-4 bg-zinc-900 rounded-2xl rounded-tl-none border border-white/5 shadow-lg">
              <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{m.user_name}</p>
              <p className="text-white text-sm leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-zinc-950 border-t border-white/10 pb-8">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-inner">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Broadcast to squad..." className="flex-1 bg-transparent px-4 py-2 outline-none text-white text-sm" />
          <button onClick={send} className="bg-white text-black px-8 py-2 rounded-full font-black uppercase text-[10px] active:scale-95 transition-all">Post</button>
        </div>
      </div>
    </div>
  );
}

// --- FESTIVALCARD ---
function FestivalCard({ fest, onOpen, currentUser, currentPfp }: { fest: Festival, onOpen: () => void, currentUser: string, currentPfp: string }) {
  const [isGoing, setIsGoing] = useState(false);
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', fest.name).eq('user_name', currentUser);
      if (data && data.length > 0) setIsGoing(true);
    };
    check();
  }, [fest.name, currentUser]);
  const join = async (e: React.MouseEvent) => {
    e.stopPropagation(); if (isGoing) return;
    await supabase.from('squad').insert([{ festival_name: fest.name, user_name: currentUser, user_pfp: currentPfp }]);
    setIsGoing(true);
  };
  return (
    <div onClick={onOpen} className="relative h-[320px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer active:scale-[0.98] transition-all hover:border-white/30">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none mb-1">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{fest.location}</p>
      </div>
      <button onClick={join} className={`absolute z-20 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-2xl ${isGoing ? "bg-green-500 border-green-400 text-white" : "bg-white border-white text-black hover:scale-110"}`}>
        {isGoing ? "✓" : "+"}
      </button>
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
  }, [festivalName]);
  return (
    <div className="space-y-4">
      {attendees.map((p, i) => (
        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-md">
          <img src={p.user_pfp} className="w-10 h-10 rounded-full border border-black shadow-lg" alt="" />
          <span className="font-bold text-sm text-zinc-300 tracking-tight">{p.user_name}</span>
        </div>
      ))}
      {attendees.length === 0 && <p className="text-zinc-600 italic text-center py-4 text-xs font-bold uppercase tracking-widest opacity-50">Waiting for squad...</p>}
    </div>
  );
}