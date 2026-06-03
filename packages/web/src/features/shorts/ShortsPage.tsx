import { FiHeart, FiMessageCircle, FiShare2, FiMusic } from 'react-icons/fi';

interface Short {
  id: string;
  videoUrl: string;
  title: string;
  author: string;
  authorAvatar: string;
  likes: string;
  comments: string;
  sound: string;
}

// Mock shorts
const shorts: Short[] = [
  { id: 's1', videoUrl: '', title: 'Clappr.js quick demo ✨', author: '@dada_dev', authorAvatar: '', likes: '12K', comments: '234', sound: 'Original Sound' },
  { id: 's2', videoUrl: '', title: 'Minima node in 60 seconds ⚡', author: '@minima_core', authorAvatar: '', likes: '8.2K', comments: '156', sound: 'Tech Vibes' },
  { id: 's3', videoUrl: '', title: 'SwarmCloud P2P explained 🔥', author: '@universe_lab', authorAvatar: '', likes: '5.1K', comments: '89', sound: 'Original Sound' },
];

export default function ShortsPage() {
  return (
    <div className="flex-1 overflow-y-auto snap-y snap-mandatory h-screen">
      {shorts.map((short) => (
        <div key={short.id} className="snap-start h-full flex items-center justify-center relative bg-black">
          {/* Placeholder for video */}
          <div className="w-full max-w-[400px] aspect-[9/16] bg-gradient-to-b from-purple-900 via-black to-indigo-900 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="text-center p-8">
              <FiMusic size={48} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-bold mb-2">{short.title}</h3>
              <p className="text-gray-400 text-sm">{short.author}</p>
            </div>

            {/* Right side actions */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-5">
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <FiHeart size={22} className="text-white" />
                </div>
                <span className="text-white text-xs">{short.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <FiMessageCircle size={22} className="text-white" />
                </div>
                <span className="text-white text-xs">{short.comments}</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <FiShare2 size={22} className="text-white" />
                </div>
                <span className="text-white text-xs">Share</span>
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-4 left-4 right-16">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white text-sm font-semibold">{short.author}</span>
                <button className="px-3 py-1 border border-red-500 text-red-500 text-xs rounded-full font-medium">
                  Subscribe
                </button>
              </div>
              <p className="text-white text-sm mb-2">{short.title}</p>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FiMusic size={14} />
                <span>{short.sound}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
