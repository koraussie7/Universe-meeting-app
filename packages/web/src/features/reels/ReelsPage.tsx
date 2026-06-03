import { useState, useEffect } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiMusic, FiPlay } from 'react-icons/fi';

interface Reel {
  id: number;
  caption: string | null;
  mediaUrl: string | null;
  author: { id: number; username: string; avatar: string | null };
  _count: { likes: number; comments: number };
}

const GRADIENTS = [
  'from-purple-900 via-pink-800 to-indigo-900',
  'from-emerald-900 via-teal-800 to-cyan-900',
  'from-orange-900 via-red-800 to-rose-900',
];

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    fetch('/api/v1/feed/reels?take=10')
      .then(r => r.json())
      .then(data => setReels(data.length > 0 ? data : MOCK_REELS))
      .catch(() => setReels(MOCK_REELS));
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full snap-y snap-mandatory overflow-y-scroll">
      {reels.map((r, i) => (
        <div
          key={r.id}
          className={'relative h-[calc(100vh-4rem)] w-full snap-center flex items-center justify-center bg-gradient-to-b ' + (GRADIENTS[i % GRADIENTS.length])}
        >
          {/* Placeholder video area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center opacity-30">
              <FiPlay size={80} className="mx-auto mb-4" />
              <p className="text-2xl font-bold">{r.author.username}</p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-10">
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
                <FiHeart size={22} />
              </div>
              <span className="text-xs font-medium">{formatCount(r._count.likes)}</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
                <FiMessageCircle size={22} />
              </div>
              <span className="text-xs">{formatCount(r._count.comments)}</span>
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {r.author.avatar || r.author.username[0].toUpperCase()}
              </div>
              <span className="font-bold text-sm">@{r.author.username}</span>
              <button className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Follow
              </button>
            </div>
            {r.caption && <p className="text-sm mb-2 leading-relaxed">{r.caption}</p>}
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <FiMusic size={14} />
              <span className="truncate">Original Sound</span>
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

const MOCK_REELS = [
  { id: 1, caption: 'Friday vibes ✨ #universe', mediaUrl: null, author: { id: 1, username: 'cosmic_dancer', avatar: '👩‍🎤' }, _count: { likes: 12400, comments: 342 } },
  { id: 2, caption: 'New track dropping soon 🎵', mediaUrl: null, author: { id: 2, username: 'quantum_beats', avatar: '🎧' }, _count: { likes: 8900, comments: 156 } },
  { id: 3, caption: 'Galactic ramen tutorial 🍜', mediaUrl: null, author: { id: 3, username: 'nebula_chef', avatar: '👨‍🍳' }, _count: { likes: 6700, comments: 89 } },
];
