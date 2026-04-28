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
    friends: [
      { name: "Kendrick", pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kendrick" },
      { name: "Friend1", pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Friend1" }
    ]
  },
  {
    name: "EDC Orlando",
    location: "Orlando, FL",
    date: "2026-11-06",
    image: "https://orlando.electricdaisycarnival.com/wp-content/uploads/sites/13/2023/11/edco23_social_ig_1080x1080_lineup.jpg",
    friends: [{ name: "Kendrick", pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kendrick" }]
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
    <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden group border border-white/10 mb-4 shadow-2xl">
      {/* Background Image */}
      <img src={fest.image} alt={fest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        <div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{fest.location}</span>
          <h2 className="text-4xl font-black mt-2 leading-none uppercase tracking-tighter">{fest.name}</h2>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-5xl font-black tracking-tighter">{daysLeft}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Days Remaining</span>
            </div>

            {/* Friend Avatars */}
            <div className="flex -space-x-3">
              {fest.friends.map((friend, i) => (
                <img key={i} src={friend.pfp} className="w-12 h-12 rounded-full border-2 border-black" alt={friend.name} />
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-black bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs">+</div>
            </div>
          </div>

          {/* THE NEW BUTTON */}
          <button
            onClick={() => alert(`Success! You're added to ${fest.name} squad.`)}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
          >
            I&apos;m Going 🤘
          </button>
        </div>
      </div>
    </div>
  );
}