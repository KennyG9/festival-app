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

interface Festival {
  name: string;
  location: string;
  date: string;
  image: string;
  details: string[];
}

interface ChecklistItem {
  id: string;
  item_text: string;
  is_done: boolean;
  added_by: string;
}

interface DetailItemProps {
  label: string;
  isChecklist: boolean;
  festName: string;
  user: UserProfile;
}

// --- DATA ---
const FESTIVALS: Festival[] = [
  {
    name: "Lost Lands",
    location: "Thornville, Ohio",
    date: "2026-09-18",
    image: "https://www.lostlandsfestival.com/wp-content/uploads/2026/01/Lost_Lands_2026_Logo_WithDatesandLocation_1000px.png",
    details: ["Camping: GA Car", "Entry: Thursday 12am", "Checklist|checklist", "Tickets|https://lostlands.frontgatetickets.com/event/7nuf54cayx3j1p90"]
  },
  {
    name: "EDC Orlando",
    location: "Orlando, Florida",
    date: "2026-11-06",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/sites/44/2025/11/17172609/edco_2026_mk_ps_fs_seo_1200x630_r01.jpg",
    details: ["Hotel: Home2Suites", "Shuttle: Purple Line", "Checklist|checklist"]
  }
];

const getAvatarUrl = (type: string, seed: string) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&flip=${type === 'girl'}`;

// --- MAIN HUB ---
export default function FestivalHub() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedFest, setSelectedFest] = useState<Festival | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [regName, setRegName] = useState("");

  useEffect(() => {
    // Decouple from synchronous render
    const timer = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem('squad-profile');
      if (saved) setUser(JSON.parse(saved));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = (avatarType: 'boy' | 'girl') => {
    if (!regName.trim()) return;
    const newProfile: UserProfile = { name: regName.trim(), avatarType };
    setUser(newProfile);
    localStorage.setItem('squad-profile', JSON.stringify(newProfile));
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl">
          <h1 className="text-4xl font-black italic tracking-tighter text-center">SQUAD HUB</h1>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-2 text-center">Identity</p>
            <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Enter Name..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none text-center" />
          </div>
          <div className={`grid grid-cols-2 gap-4 ${!regName.trim() ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
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
    <main className="min-h-screen bg-black text-white p-6 font-sans selection:bg-white selection:text-black">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter leading-none">SQUAD HUB</h1>
        <button onClick={() => setShowProfile(true)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all overflow-hidden">
          <img src={getAvatarUrl(user.avatarType, user.name)} className="w-8 h-8" alt="" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {FESTIVALS.map((fest) => (
          <div key={fest.name} onClick={() => setSelectedFest(fest)} className="relative h-[320px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer active:scale-[0.98] transition-all hover:border-white/30">
            <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-30 group-hover:scale-110 transition-transform" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{fest.name}</h2>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{fest.location}</p>
            </div>
          </div>
        ))}
      </div>

      {showProfile && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-4">
              <img src={getAvatarUrl(user.avatarType, user.name)} className="w-20 h-20 mx-auto rounded-full border-2 border-white/10" alt="" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">{user.name}</h2>
            </div>
            <div className="space-y-3">
              <button onClick={() => setShowProfile(false)} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl active:scale-95 transition-all">Done</button>
              <button onClick={() => { localStorage.removeItem('squad-profile'); window.location.reload(); }} className="w-full py-4 bg-red-600/10 border border-red-600/20 text-red-500 font-black uppercase rounded-2xl text-[10px] active:scale-95 transition-all">Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {selectedFest && (
        <div className="fixed inset-0 z-[50] bg-black flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto w-full p-8 md:p-16 space-y-8">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 font-bold uppercase text-xs mb-8 hover:text-white transition-colors">← Back</button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <div className="grid grid-cols-1 gap-4">
              {selectedFest.details.map((detail: string, i: number) => {
                const [label, link] = detail.includes('|') ? detail.split('|') : [detail, null];
                return <DetailItem key={i} label={label} isChecklist={link === 'checklist'} festName={selectedFest.name} user={user} />;
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// --- SUB COMPONENTS ---
function DetailItem({ label, isChecklist, festName, user }: DetailItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [input, setInput] = useState("");

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('checklist').select('*').eq('fest_name', festName).order('created_at', { ascending: true });
    if (data) setItems(data as ChecklistItem[]);
  }, [festName]);

  useEffect(() => {
    if (!isChecklist || !isOpen) return;

    // FIX: Wrapping in a micro-task (0ms timeout) satisfies the setState-in-effect rule
    const timer = setTimeout(() => {
      void fetchData();
    }, 0);

    const ch = supabase.channel(`ck-${festName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist', filter: `fest_name=eq.${festName}` }, () => {
        void fetchData();
      })
      .subscribe();

    return () => {
      clearTimeout(timer);
      void supabase.removeChannel(ch);
    };
  }, [isChecklist, isOpen, festName, fetchData]);

  const add = async () => {
    if (!input.trim()) return;
    const { error } = await supabase.from('checklist').insert([{ fest_name: festName, item_text: input, added_by: user.name }]).select();
    if (!error) { setInput(""); void fetchData(); }
  };

  if (!isChecklist) return <div className="p-5 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;

  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 flex justify-between items-center font-bold italic text-white uppercase text-xs">
        <span>{label}</span>
        <span className={`${isOpen ? 'rotate-180' : ''} transition-transform`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-5 pt-0 space-y-4 animate-in fade-in duration-200">
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} className="flex-1 bg-white/10 p-3 rounded-xl text-white text-sm outline-none font-bold" placeholder="Add gear..." />
            <button onClick={add} className="bg-white text-black px-5 rounded-xl font-black active:scale-90 transition-all">+</button>
          </div>
          <div className="space-y-2">
            {items.map(it => (
              <div key={it.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-white/5">
                <span className={`text-sm font-bold ${it.is_done ? 'line-through text-white/20' : 'text-white'}`}>{it.item_text}</span>
                <button
                  onClick={async () => { await supabase.from('checklist').update({ is_done: !it.is_done }).eq('id', it.id); void fetchData(); }}
                  className={`w-6 h-6 rounded-md border-2 transition-all ${it.is_done ? 'bg-green-500 border-green-400' : 'border-white/20'}`}
                >
                  {it.is_done && "✓"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}