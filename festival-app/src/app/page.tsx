"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE SETUP ---
const supabaseUrl = 'https://avnbzaskdrpyjtwvmlvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bmJ6YXNrZHJweWp0d3ZtbHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTM2MDYsImV4cCI6MjA5Mjk2OTYwNn0.aKnSzoJR08jG8ayVzKjUKoWSqu4uo8tg3J3E9wKzdg4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Define the Shapes of your data
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
}

const FESTIVALS: Festival[] = [
  {
    name: "Lost Lands",
    location: "Thornville, Ohio",
    date: "2026-09-18",
    image: "https://www.lostlandsfestival.com/wp-content/uploads/2026/01/Lost_Lands_2026_Logo_WithDatesandLocation_1000px.png",
  },
  {
    name: "EDC Orlando",
    location: "Orlando, Florida",
    date: "2026-11-06",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/sites/44/2025/11/17172609/edco_2026_mk_ps_fs_seo_1200x630_r01.jpg",
  },
  {
    name: "Cyclops Cove 4",
    location: "Boca Raton, Florida",
    date: "2026-12-04",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/2026/01/21190300/BjPk34sanaF62djjVmwlSzWUelCf6j0xXHFlrmNo-972x597.png",
  }
];

export default function FestivalHub() {
  return (
    <main className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="mb-10 pt-6">
        <h1 className="text-4xl font-black tracking-tighter italic leading-none text-white">SQUAD HUB</h1>
        <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">Live Sync Enabled</p>
      </header>
      <div className="space-y-8">
        {FESTIVALS.map((fest) => (
          <FestivalCard key={fest.name} fest={fest} />
        ))}
      </div>
    </main>
  );
}

function FestivalCard({ fest }: { fest: Festival }) {
  const [daysLeft, setDaysLeft] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isGoing, setIsGoing] = useState(false);

  const MY_NAME = "Kendrick";
  const MY_PFP = `https://api.dicebear.com/7.x/avataaars/svg?seed=${MY_NAME}`;

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = +new Date(fest.date) - +new Date();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }, 1000);

    const fetchAttendees = async () => {
      const { data } = await supabase
        .from('squad')
        .select('*')
        .eq('festival_name', fest.name);

      if (data) {
        setAttendees(data);
        setIsGoing(data.some((u: Attendee) => u.user_name === MY_NAME));
      }
    };

    fetchAttendees();

    const channel = supabase
      .channel(`realtime-${fest.name}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'squad', filter: `festival_name=eq.${fest.name}` },
        (payload) => {
          const newAttendee = payload.new as Attendee;
          setAttendees(prev => [...prev, newAttendee]);
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [fest.name, fest.date]);

  const handleJoin = async () => {
    if (isGoing) return;

    const { error } = await supabase
      .from('squad')
      .insert([
        { festival_name: fest.name, user_name: MY_NAME, user_pfp: MY_PFP }
      ]);

    if (!error) setIsGoing(true);
  };

  return (
    <div className="relative h-[480px] w-full rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
      <img src={fest.image} alt="" className="absolute inset-0 w-full h-full object-contain p-16 select-none opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-5xl font-black leading-none uppercase tracking-tighter">{fest.name}</h2>
          <p className="text-sm font-bold text-white/60 mt-2 uppercase tracking-[0.3em]">{fest.location}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-6xl font-black tracking-tighter">{daysLeft}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Days Remaining</span>
            </div>

            <div className="flex -space-x-4">
              {attendees.map((person, i) => (
                <img key={i} src={person.user_pfp} className="w-14 h-14 rounded-full border-4 border-black shadow-lg" alt={person.user_name} />
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-black bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-sm">+</div>
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={isGoing}
            className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl text-sm ${isGoing ? "bg-green-500 text-white" : "bg-white text-black hover:bg-gray-200 active:scale-95"
              }`}
          >
            {isGoing ? "You're Going!! ✅" : "I'm Going 🤘"}
          </button>
        </div>
      </div>
    </div>
  );
}