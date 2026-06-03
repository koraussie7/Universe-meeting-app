import { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiMusic, FiPlay } from 'react-icons/fi';

const MOCK_REELS = [
  {
    id: 1,
    user: '@cosmic_dancer',
    avatar: '👩‍🎤',
    caption: 'Friday vibes in the metaverse ✨ #dance #universe',
    song: 'Stellar Drift - Cosmic Waves',
    likes: 12400,
    comments: 342,
    color: 'from-purple-900 via-pink-800 to-indigo-900',
  },
  {
    id: 2,
    user: '@quantum_beats',
    avatar: '🎧',
    caption: 'New track dropping soon 🎵 Who is ready?',
    song: 'Original Sound - quantum_beats',
    likes: 8900,
    comments: 156,
    color: 'from-emerald-900 via-teal-800 to-cyan-900',
  },
  {
    id: 3,
    user: '@nebula_chef',
    avatar: '👨‍🍳',
    caption: 'Galactic ramen tutorial 🍜 #cooking #spacefood',
    song: 'Lo-fi Kitchen Beats',
    likes: 6700,
    comments: 89,
    color: 'from-orange-900 via-red-800 to-rose-900',
  },
];

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full snap-y snap-mandatory overflow-y-scroll">
      {MOCK_REELS.map((r) => (
        <div
          key={r.id}
          className={"relative h-[calc(100vh-4rem)] w-full snap-center flex items-center justify-center bg-gradient-to-b " + r.color}
        >
          {/* Placeholder video area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center opacity-30">
              <FiPlay size={80} className="mx-auto mb-4" />
              <p className="text-2xl font-bold">{r.user}</p>
            </div>
          </div>

          {/* Right sidebar - actions */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-10">
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
                <FiHeart size={22} />
              </div>
              <span className="text-xs font-medium">{formatCount(r.likes)}</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
                <FiMessageCircle size={22} />
              </div>
              <span className="text-xs">{formatCount(r.comments)}</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
                <FiShare2 size={22} />
              </div>
              <span className="text-xs">Share</span>
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-16 left-3 right-16 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{r.avatar}</span>
              <span className="font-bold text-sm">{r.user}</span>
              <button className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Follow
              </button>
            </div>
            <p className="text-sm mb-2 leading-relaxed">{r.caption}</p>
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <FiMusic size={14} />
              <span className="truncate">{r.song}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}
