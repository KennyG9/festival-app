"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

// 1. The "Rulebook" - This defines exactly what a Festival looks like
interface Festival {
  name: string;
  location: string;
  date: string;
  image: string;
  friends: { name: string; pfp: string }[];
}

// 2. Your Festival Data - All your dates and locations are here
const FESTIVALS: Festival[] = [
  {
    name: "Lost Lands",
    location: "Thornville, Ohio",
    date: "2026-09-18",
    image: "https://www.lostlandsfestival.com/wp-content/uploads/2026/01/Lost_Lands_2026_Logo_WithDatesandLocation_1000px.png",
    friends: [
      { name: "Kendrick", pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kendrick" },
      { name: "Friend1", pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Friend1" }
    ]
  },
  {
    name: "EDC Orlando",
    location: "Orlando, Florida",
    date: "2026-11-06",
    image: "https://static-label.frontgatetickets.com/label/1634/img/header.png",
    friends: [{ name: "Kendrick", pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kendrick" }]
  },
  {
    name: "Cyclops Cove 4",
    location: "Boca Raton, Florida",
    date: "2026-12-04",
    image: "https://pbs.twimg.com/media/F9F2A6rX0AA0X6X.jpg",
    friends: []
  }
];

export default function FestivalHub() {
  return (
    <main className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="mb-10 pt-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic leading-none">2026 Festivals</h1>
          <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">{FESTIVALS.length} Events Scheduled</p>
        </div>
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

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = +new Date(fest.date) - +new Date();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }, 1000);
    return () => clearInterval(timer);
  }, [fest.date]);

  return (
    <div className="relative h-[480px] w-full rounded-[3rem] overflow-hidden group border border-white/10 shadow-2xl bg-zinc-900">
      {/* Background Image - Added "object-top" and "select-none" to prevent text leaks */}
      <img
        src={fest.image}
        alt=""
        className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-1000 group-hover:scale-110 select-none"
      />

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* App Content UI */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">

        {/* Top Section */}
        <div className="pointer-events-auto">
          <h2 className="text-5xl font-black leading-none uppercase tracking-tighter drop-shadow-2xl">
            {fest.name}
          </h2>
          <p className="text-sm font-bold text-white/60 mt-2 uppercase tracking-[0.3em]">
            {fest.location}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="space-y-6 pointer-events-auto">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-6xl font-black tracking-tighter leading-none">{daysLeft}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Days Remaining</span>
            </div>

            {/* Friend Avatars */}
            <div className="flex -space-x-4">
              {fest.friends.map((friend, i) => (
                <img
                  key={i}
                  src={friend.pfp}
                  className="w-14 h-14 rounded-full border-4 border-black shadow-lg"
                  alt=""
                />
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-black bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-sm">+</div>
            </div>
          </div>

          {/* Interactive Action Button */}
          <button
            onClick={() => alert(`SQUAD UPDATED: You are locked in for ${fest.name}!`)}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all active:scale-95 shadow-2xl text-sm"
          >
            I&apos;m Going 🤘
          </button>
        </div>
      </div>
    </div>
  );
}