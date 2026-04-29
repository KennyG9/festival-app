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

// Helper to get the correct avatar URL based on choice
const getAvatarUrl = (type: string) => {
  const seed = type === 'boy' ? 'Felix' : 'Aneka';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

export default function FestivalHub() {
  const [selectedFest, setSelectedFest] = useState<Festival | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSurvivalWall, setShowSurvivalWall] = useState(false); // New state for the wall

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

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="p-6">
        <header className="mb-10 pt-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter leading-none">SQUAD HUB</h1>
            <p className="text-zinc-500 font-bold mt-1 uppercase text-[10px] tracking-widest">
              Live Sync • Welcome, {userName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* SURVIVAL WALL BUTTON */}
            <button
              onClick={() => setShowSurvivalWall(true)}
              className="hidden md:flex h-12 px-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 items-center gap-2 hover:bg-orange-500/20 transition-all active:scale-95"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Survival Wall</span>
            </button>

            {/* MESSAGES ICON */}
            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            {/* SHARE BUTTON */}
            <button
              onClick={async () => {
                const shareData = { title: 'SQUAD HUB', url: window.location.href };
                try {
                  if (navigator.share) {
                    await navigator.share(shareData);
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link Copied!');
                  }
                } catch (err) {
                  console.error('Share failed:', err);
                }
              }}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </button>

            {/* PROFILE */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden active:scale-90"
            >
              <img src={getAvatarUrl(avatarType)} className="w-9 h-9" alt="Profile" />
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
              currentPfp={getAvatarUrl(avatarType)}
            />
          ))}
        </div>
      </div>

      {/* --- SETTINGS DRAWER --- */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-4">
              <img src={getAvatarUrl(avatarType)} className="w-24 h-24 rounded-full border-4 border-white/10 mx-auto" alt="Avatar" />
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
            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl">Done</button>
          </div>
        </div>
      )}

      {/* --- SURVIVAL WALL DRAWER --- */}
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

      {/* --- EXPANDED DETAIL VIEW --- */}
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
            <h3 className="text-xl font-black uppercase mb-8">The Squad</h3>
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
          <span className="font-bold">{person.user_name}</span>
        </div>
      ))}
    </div>
  );
}

function FestivalCard({ fest, onOpen, currentUser, currentPfp }: { fest: Festival, onOpen: () => void, currentUser: string, currentPfp: string }) {
  const [isGoing, setIsGoing] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const diff = +new Date(fest.date) - +new Date();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    };
    calculateDays();
    const checkStatus = async () => {
      if (!currentUser) return;
      const { data } = await supabase.from('squad').select('*').eq('festival_name', fest.name).eq('user_name', currentUser);
      setIsGoing(data && data.length > 0 ? true : false);
    };
    checkStatus();
  }, [fest.name, fest.date, currentUser]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGoing) return;
    const { error } = await supabase.from('squad').insert([{ festival_name: fest.name, user_name: currentUser, user_pfp: currentPfp }]);
    if (!error) setIsGoing(true);
  };

  return (
    <div onClick={onOpen} className="relative h-[300px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-50 group-hover:opacity-70 transition-opacity" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] animate-pulse">{daysLeft} Days to go</span>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">{fest.location}</p>
      </div>
      <button onClick={handleJoin} className={`absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${isGoing ? "bg-green-500 border-green-400 text-white" : "bg-white border-white text-black active:scale-90"}`}>
        {isGoing ? <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
      </button>
    </div>
  );
}

function DetailItem({ label, link }: { label: string; link: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!link) return <div className="p-4 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center font-bold italic">
        <span>{label}</span>
        <span className={`transition-transform duration-300 text-[10px] ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 animate-in slide-in-from-top-2">
          <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-white text-black rounded-xl text-center text-xs font-black uppercase">Open Official Link ↗</a>
        </div>
      )}
    </div>
  );
}