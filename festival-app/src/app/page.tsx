"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avnbzaskdrpyjtwvmlvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bmJ6YXNrZHJweWp0d3ZtbHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM2MDYsImV4cCI6MjA5Mjk2OTYwNn0.aKnSzoJR08jG8ayVzKjUKoWSqu4uo8tg3J3E9wKzdg4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    details: ["Camping: GA Car", "Entry: Thursday", "Vibe: Heavy Bass"]
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

export default function FestivalHub() {
  const [selectedFest, setSelectedFest] = useState<Festival | null>(null);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="p-6">
        <header className="mb-10 pt-6">
          <h1 className="text-4xl font-black italic tracking-tighter leading-none">SQUAD HUB</h1>
          <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">Tap card for details • Click + to join</p>
        </header>

        <div className="space-y-8">
          {FESTIVALS.map((fest) => (
            <FestivalCard
              key={fest.name}
              fest={fest}
              onOpen={() => setSelectedFest(fest)}
            />
          ))}
        </div>
      </div>

      {/* --- EXPANDED DETAIL VIEW --- */}
      {selectedFest && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex-1 p-8 md:p-16 space-y-8">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 hover:text-white font-bold uppercase text-xs mb-8 flex items-center gap-2">
              ← Close
            </button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <p className="text-xl text-white/70 max-w-xl">{selectedFest.description}</p>

            <div className="space-y-4 pt-8">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Festival Details</h3>
              <div className="grid grid-cols-1 gap-4">
                {selectedFest.details.map((detail, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl font-bold italic">
                    {detail}
                  </div>
                ))}
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

function SquadList({ festivalName }: { festivalName: string }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', festivalName);
      if (data) setAttendees(data);
    };
    fetch();

    const channel = supabase
      .channel(`squad-${festivalName}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'squad', filter: `festival_name=eq.${festivalName}` },
        (payload) => setAttendees(prev => [...prev, payload.new as Attendee]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [festivalName]);

  return (
    <div className="space-y-4">
      {attendees.map((person, i) => (
        <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 animate-in fade-in zoom-in duration-300">
          <img src={person.user_pfp} className="w-12 h-12 rounded-full border-2 border-black" alt="" />
          <span className="font-bold">{person.user_name}</span>
        </div>
      ))}
      {attendees.length === 0 && <p className="text-gray-600 italic">No one locked in yet...</p>}
    </div>
  );
}

function FestivalCard({ fest, onOpen }: { fest: Festival, onOpen: () => void }) {
  const [isGoing, setIsGoing] = useState(false);
  const MY_NAME = "Kendrick";
  const MY_PFP = `https://api.dicebear.com/7.x/avataaars/svg?seed=${MY_NAME}`;

  useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase
        .from('squad')
        .select('*')
        .eq('festival_name', fest.name)
        .eq('user_name', MY_NAME);
      if (data && data.length > 0) setIsGoing(true);
    };
    checkStatus();
  }, [fest.name]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening the detail view when clicking the button
    if (isGoing) return;

    const { error } = await supabase
      .from('squad')
      .insert([{ festival_name: fest.name, user_name: MY_NAME, user_pfp: MY_PFP }]);

    if (!error) setIsGoing(true);
  };

  return (
    <div
      onClick={onOpen}
      className="relative h-[300px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-xl active:scale-[0.98] transition-all group cursor-pointer"
    >
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-50 group-hover:opacity-70 transition-opacity" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute bottom-8 left-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">{fest.location}</p>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleJoin}
        className={`absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl border-2 ${isGoing
            ? "bg-green-500 border-green-400 text-white"
            : "bg-white border-white text-black hover:scale-110 active:scale-90"
          }`}
      >
        {isGoing ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        )}
      </button>
    </div>
  );
}