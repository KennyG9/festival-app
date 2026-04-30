"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  details: string[];
}

interface Message {
  id: string;
  created_at: string;
  user_name: string;
  content: string;
}

interface ChecklistItem {
  id: string;
  item_text: string;
  is_done: boolean;
  added_by: string;
  category: string;
  position: number;
}

interface DetailItemProps {
  label: string;
  isChecklist: boolean;
  festName: string;
  user: UserProfile;
  link?: string | null;
}

interface CategoryBubbleProps {
  cat: string;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

// --- DATA ---
const FESTIVALS: Festival[] = [
  {
    name: "Lost Lands",
    location: "Thornville, Ohio",
    date: "2026-09-18",
    image: "https://www.lostlandsfestival.com/wp-content/uploads/2026/01/Lost_Lands_2026_Logo_WithDatesandLocation_1000px.png",
    details: ["Camping: 4 Days", "Entry: Leave Wed 8am Arrive Thur 12am", "Checklist|checklist", "Tickets|https://lostlands.frontgatetickets.com/event/7nuf54cayx3j1p90"]
  },
  {
    name: "EDC Orlando",
    location: "Orlando, Florida",
    date: "2026-11-06",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/sites/44/2025/11/17172609/edco_2026_mk_ps_fs_seo_1200x630_r01.jpg",
    details: ["Hotel: Home2Suites", "Shuttle: Purple Line", "Checklist|checklist"]
  },
  {
    name: "Cyclops Cove 4",
    location: "Boca Raton, Florida",
    date: "2026-12-04",
    image: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/2026/01/21190300/BjPk34sanaF62djjVmwlSzWUelCf6j0xXHFlrmNo-972x597.png",
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
  const [isUpdating, setIsUpdating] = useState(false);

  // VERSION CONTROL LOGIC
  const checkForUpdates = useCallback(async (manual = false) => {
    if (manual) setIsUpdating(true);
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'reload',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });

      if (res.ok) {
        const data = await res.json();
        const latestVersion = data.version;
        const localVersion = localStorage.getItem('squad_app_version');

        if (localVersion && parseInt(localVersion) < latestVersion) {
          localStorage.setItem('squad_app_version', latestVersion.toString());
          // Force a full clean reload
          window.location.href = window.location.origin + window.location.pathname + '?u=' + latestVersion;
          return true;
        } else if (!localVersion) {
          localStorage.setItem('squad_app_version', latestVersion.toString());
        } else if (manual) {
          alert("App is up to date!");
        }
      }
    } catch (err) {
      console.error("Update check failed:", err);
    } finally {
      if (manual) setIsUpdating(false);
    }
    return false;
  }, []);

  useEffect(() => {
    const init = async () => {
      await checkForUpdates();
      setMounted(true);
      const saved = localStorage.getItem('squad-profile');
      if (saved) setUser(JSON.parse(saved));
    };
    init();
  }, [checkForUpdates]);

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
          <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Display Name..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-white outline-none text-center" />
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
    <main className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter leading-none">SQUAD HUB</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowMessages(true)} className="h-12 px-4 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest">Messages</button>
          <button onClick={() => setShowProfile(true)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all overflow-hidden">
            <img src={getAvatarUrl(user.avatarType, user.name)} className="w-8 h-8" alt="" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {FESTIVALS.map((fest) => (
          <FestivalCard key={fest.name} fest={fest} onOpen={() => setSelectedFest(fest)} currentUser={user} />
        ))}
      </div>

      <MessageWall isOpen={showMessages} onClose={() => setShowMessages(false)} user={user} />

      {showProfile && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-4">
              <img src={getAvatarUrl(user.avatarType, user.name)} className="w-20 h-20 mx-auto rounded-full border-2 border-white/10" alt="" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">{user.name}</h2>
            </div>
            <div className="space-y-3">
              <button onClick={() => setShowProfile(false)} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl active:scale-95 transition-all">Done</button>

              <button
                onClick={() => checkForUpdates(true)}
                disabled={isUpdating}
                className="w-full py-4 bg-zinc-800 text-white font-black uppercase rounded-2xl text-[10px] border border-white/10 active:scale-95 transition-all disabled:opacity-50"
              >
                {isUpdating ? "Checking..." : "Check for Update"}
              </button>

              <button onClick={() => { localStorage.removeItem('squad-profile'); window.location.reload(); }} className="w-full py-4 bg-red-600/10 border border-red-600/20 text-red-500 font-black uppercase rounded-2xl text-[10px]">Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {selectedFest && (
        <div className="fixed inset-0 z-[50] bg-black flex flex-col md:flex-row overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex-1 p-8 md:p-16 space-y-8">
            <button onClick={() => setSelectedFest(null)} className="text-white/50 font-bold uppercase text-xs mb-8 hover:text-white transition-colors">← Back</button>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">{selectedFest.name}</h2>
            <div className="grid grid-cols-1 gap-4">
              {selectedFest.details.map((detail: string, i: number) => {
                const [label, link] = detail.includes('|') ? detail.split('|') : [detail, null];
                return (
                  <DetailItem
                    key={i}
                    label={label}
                    link={link}
                    isChecklist={link === 'checklist'}
                    festName={selectedFest.name}
                    user={user}
                  />
                );
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

// --- SUB-COMPONENTS ---

function DetailItem({ label, isChecklist, festName, user, link }: DetailItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("Essentials");
  const categories = ["Essentials", "Camping", "Clothing", "Tech", "Misc"];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from('checklist')
      .select('*')
      .eq('fest_name', festName)
      .order('position', { ascending: true });

    if (data) {
      setItems(data.map(item => ({ ...item, category: item.category || 'Essentials' })) as ChecklistItem[]);
    }
  }, [festName]);

  useEffect(() => {
    if (!isChecklist || !isOpen) return;
    const timer = setTimeout(() => { void fetchData(); }, 0);
    const ch = supabase.channel(`ck-${festName}`).on('postgres_changes', { event: '*', schema: 'public', table: 'checklist', filter: `fest_name=eq.${festName}` }, () => { void fetchData(); }).subscribe();
    return () => { clearTimeout(timer); void supabase.removeChannel(ch); };
  }, [isChecklist, isOpen, festName, fetchData]);

  const add = async () => {
    if (!input.trim()) return;
    const newPos = items.length > 0 ? Math.max(...items.map(i => i.position)) + 1 : 0;
    const { error } = await supabase.from('checklist').insert([{
      fest_name: festName,
      item_text: input,
      added_by: user.name,
      category: activeCategory,
      position: newPos
    }]).select();
    if (!error) { setInput(""); void fetchData(); }
  };

  const deleteItem = async (id: string) => {
    await supabase.from('checklist').delete().eq('id', id);
    void fetchData();
  };

  const toggleItem = async (it: ChecklistItem) => {
    await supabase.from('checklist').update({ is_done: !it.is_done }).eq('id', it.id);
    void fetchData();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overId = over.id as string;

    if (categories.includes(overId)) {
      const activeItem = items.find(i => i.id === active.id);
      if (activeItem && activeItem.category !== overId) {
        const filteredItems = items.filter(i => i.category === overId);
        const newPos = filteredItems.length > 0 ? Math.max(...filteredItems.map(i => i.position)) + 1 : 0;
        await supabase.from('checklist').update({ category: overId, position: newPos }).eq('id', active.id);
        void fetchData();
        return;
      }
    }

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      setItems(newArray);
      await supabase.from('checklist').upsert(newArray.map((item, idx) => ({
        id: item.id, position: idx, fest_name: festName, item_text: item.item_text, category: item.category
      })));
    }
  };

  if (!isChecklist) {
    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="p-5 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90 hover:bg-white/10 hover:border-green-500 transition-all flex justify-between items-center group">
          <span>{label}</span>
          <span className="text-[10px] text-zinc-500 group-hover:text-green-500">OPEN LINK ↗</span>
        </a>
      );
    }
    return <div className="p-5 bg-white/5 border border-white/10 rounded-2xl font-bold italic text-white/90">{label}</div>;
  }

  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 flex justify-between items-center font-bold italic text-white uppercase text-xs">
        <span>{label}</span>
        <span className={`${isOpen ? 'rotate-180' : ''} transition-transform`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-5 pt-0 space-y-6 animate-in fade-in duration-200">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                <CategoryBubble key={cat} cat={cat} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              ))}
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} className="flex-1 bg-white/10 p-3 rounded-xl text-white text-sm outline-none font-bold" placeholder={`Add to ${activeCategory}...`} />
              <button onClick={add} className="bg-white text-black px-5 rounded-xl font-black">+</button>
            </div>
            {categories.map(cat => {
              const categoryItems = items.filter(i => i.category === cat);
              if (categoryItems.length === 0 && activeCategory !== cat) return null;
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center gap-2 opacity-30">
                    <div className="h-[1px] flex-1 bg-white/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{cat}</span>
                    <div className="h-[1px] flex-1 bg-white/20" />
                  </div>
                  <SortableContext items={categoryItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {categoryItems.map(it => (
                        <SortableSwipeItem key={it.id} it={it} onDelete={() => deleteItem(it.id)} onToggle={() => toggleItem(it)} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </DndContext>
        </div>
      )}
    </div>
  );
}

function CategoryBubble({ cat, activeCategory, setActiveCategory }: CategoryBubbleProps) {
  const { setNodeRef, isOver } = useSortable({ id: cat, disabled: true });
  return (
    <button ref={setNodeRef} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap border-2 ${isOver ? 'border-green-500 bg-green-500/20' : 'border-transparent'} ${activeCategory === cat ? 'bg-white text-black scale-105' : 'bg-white/5 text-zinc-500'}`}>{cat}</button>
  );
}

function SortableSwipeItem({ it, onDelete, onToggle }: { it: ChecklistItem, onDelete: () => void, onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: it.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 100 : 1, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style}>
      <SwipeableItem onDelete={onDelete}>
        <div className="flex items-center gap-3 w-full">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1"><svg width="12" height="12" viewBox="0 0 20 20" fill="#52525b"><path d="M7 2a2 2 0 10-4 0 2 2 0 004 0zM7 10a2 2 0 10-4 0 2 2 0 004 0zM7 18a2 2 0 10-4 0 2 2 0 004 0zM17 2a2 2 0 10-4 0 2 2 0 004 0zM17 10a2 2 0 10-4 0 2 2 0 004 0zM17 18a2 2 0 10-4 0 2 2 0 004 0z" /></svg></div>
          <span className={`flex-1 text-sm font-bold ${it.is_done ? 'line-through text-white/20' : 'text-white'}`}>{it.item_text}</span>
          <button onClick={onToggle} className={`w-6 h-6 rounded-md border-2 transition-all ${it.is_done ? 'bg-green-500 border-green-400' : 'border-white/20'}`}>{it.is_done && "✓"}</button>
        </div>
      </SwipeableItem>
    </div>
  );
}

function SwipeableItem({ children, onDelete }: { children: React.ReactNode, onDelete: () => void }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const onStart = (e: React.TouchEvent | React.MouseEvent) => setStartX('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX);
  const onMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === 0) return;
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = x - startX;
    if (diff < 0) setCurrentX(diff);
  };
  const onEnd = () => { if (currentX < -60) setCurrentX(-80); else setCurrentX(0); setStartX(0); };
  return (
    <div className="relative overflow-hidden rounded-xl bg-red-600">
      <button onClick={onDelete} className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center text-[10px] font-black uppercase text-white">Delete</button>
      <div className="relative bg-zinc-900 border border-white/5 p-3 flex justify-between items-center transition-transform duration-200 ease-out" style={{ transform: `translateX(${currentX}px)` }} onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} onMouseDown={onStart} onMouseMove={(e) => onMove(e)} onMouseUp={onEnd} onMouseLeave={onEnd}>{children}</div>
    </div>
  );
}

function MessageWall({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: UserProfile }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const fetchWall = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(25);
    if (data) setMessages(data as Message[]);
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => { void fetchWall(); }, 0);
    const ch = supabase.channel('wall').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => { void fetchWall(); }).subscribe();
    return () => { clearTimeout(timer); void supabase.removeChannel(ch); };
  }, [isOpen, fetchWall]);
  const send = async () => {
    if (!input.trim()) return;
    const { error } = await supabase.from('messages').insert([{ user_name: user.name, content: input }]).select();
    if (!error) { setInput(""); void fetchWall(); }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950">
        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Messages</h2>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-1 p-4 bg-zinc-900 rounded-2xl rounded-tl-none border border-white/5 shadow-lg">
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{m.user_name}</p>
              <p className="text-white text-sm">{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-zinc-950 border-t border-white/10">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-inner">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} className="flex-1 bg-transparent px-4 py-2 text-white outline-none text-sm" placeholder="Message squad..." />
          <button onClick={send} className="bg-white text-black px-6 rounded-full font-black uppercase text-[10px] active:scale-95">Post</button>
        </div>
      </div>
    </div>
  );
}

function FestivalCard({ fest, onOpen, currentUser }: { fest: Festival, onOpen: () => void, currentUser: UserProfile }) {
  const [isGoing, setIsGoing] = useState(false);
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.from('squad').select('*').eq('festival_name', fest.name).eq('user_name', currentUser.name);
      if (data && data.length > 0) setIsGoing(true);
    };
    void check();
  }, [fest.name, currentUser.name]);
  const join = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGoing) return;
    const { error } = await supabase.from('squad').insert([{
      festival_name: fest.name,
      user_name: currentUser.name,
      user_pfp: getAvatarUrl(currentUser.avatarType, currentUser.name)
    }]).select();
    if (!error) setIsGoing(true);
  };
  return (
    <div onClick={onOpen} className="relative h-[320px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer active:scale-[0.98] transition-all">
      <img src={fest.image} className="absolute inset-0 w-full h-full object-contain p-12 opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">{fest.name}</h2>
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">{fest.location}</p>
      </div>
      <button onClick={join} className={`absolute z-20 bottom-6 right-6 w-14 h-14 rounded-full border-2 transition-all shadow-xl ${isGoing ? "bg-green-500 border-green-400 text-white" : "bg-white text-black"}`}>
        {isGoing ? "✓" : "+"}
      </button>
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
    void f();
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