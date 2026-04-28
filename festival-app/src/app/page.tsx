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
          <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest tracking-widest">Tap card for details</p>
        </header>

        <div className="space-y-8">
          {FESTIVALS.map((fest) => (
            <div key={fest.name} onClick={() => setSelectedFest(fest)} className="cursor-pointer">
              <FestivalCard fest={fest} />
            </div>
          ))}
        </div>
      </div>

      {/* --- EXPANDED DETAIL VIEW --- */}
      {selectedFest && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          {/* Left Side: Info */}
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
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl font-bold">
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Squad List */}
          <div className="w-full md:w-96 bg-zinc-950 border-l border-white/10 p-8">
            <h3 className="text-xl font-black uppercase mb-8">The Squad</h3>
            <SquadList festivalName={selectedFest.name} />
          </div>
        </div>
      )}
    </main>
  );
}

// Separate component for the Squad List to handle its own loading
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
          <span className="font-bold">{person.user_name}</span>
        </div>
      ))}
      {attendees.length === 0 && <p className="text-gray-600 italic">No one locked in yet...</p>}
    </div>
  );
}

// Simplified Card for the Main List
function FestivalCard({ fest }: { fest: Festival }) {
  return (
    <div className="relative h-[300px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-xl active:scale-95 transition-all">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-50" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter">{fest.name}</h2>
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{fest.location}</p>
      </div>
    </div>
  );
}