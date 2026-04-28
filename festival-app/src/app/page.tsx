"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

// This is the "Rulebook" that stops the errors
interface Festival {
  name: string;
  location: string;
  date: string;
  image: string;
  friends: { name: string; pfp: string }[];
}

const FESTIVALS: Festival[] = [
  {
    name: "Lost Lands",
    location: "Thornville, OH",
    date: "2026-09-18",
    image: "https://www.lostlandsfestival.com/wp-content/uploads/2024/01/LL24_Social_IG_1080x1080_V1.jpg",
    friends: [{ name: "User", pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" }]
  },
  {
    name: "EDC Orlando",
    location: "Orlando, FL",
    date: "2026-11-06",
    image: "https://orlando.electricdaisycarnival.com/wp-content/uploads/sites/13/2023/11/edco23_social_ig_1080x1080_lineup.jpg",
    friends: []
  },
  {
    name: "Cyclops Cove 4",
    location: "Boca Raton, FL",
    date: "2026-12-04",
    image: "https://pbs.twimg.com/media/F9F2A6rX0AA0X6X.jpg",
    friends: []
  }
];

export default function FestivalHub() {
  return (
    <main className="min-h-screen bg-black text-white p-4 font-sans">
      <header className="mb-8 pt-4">
        <h1 className="text-4xl font-black tracking-tighter italic">FESTIVAL HUB</h1>
        <p className="text-gray-500 font-medium">The 2026 Season</p>
      </header>

      <div className="space-y-6">
        {FESTIVALS.map((fest) => (
          <FestivalCard key={fest.name} fest={fest} />
        ))}
      </div>
    </main>
  );
}

function FestivalCard({ fest }: { fest: Festival }) {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = +new Date(fest.date) - +new Date();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }, 1000);
    return () => clearInterval(timer);
  }, [fest.date]);

  return (
    <div className="relative h-72 w-full rounded-[2.5rem] overflow-hidden group border border-white/10">
      <img src={fest.image} alt={fest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        <div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{fest.location}</span>
          <h2 className="text-3xl font-black mt-2 leading-none uppercase">{fest.name}</h2>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-5xl font-black tracking-tighter">{daysLeft}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Days Remaining</span>
          </div>

          <div className="flex -space-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-black bg-yellow-400 flex items-center justify-center text-black font-bold text-xs">Me</div>
            <div className="w-12 h-12 rounded-full border-2 border-black bg-purple-500 flex items-center justify-center text-white font-bold text-xs">+</div>
          </div>
        </div>
      </div>
    </div>
  );
}