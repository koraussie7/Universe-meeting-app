import { FiHeart, FiMessageCircle, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';

const MOCK_POSTS = [
  {
    id: 1,
    user: { name: 'stellar_explorer', avatar: '🚀' },
    image: null,
    type: 'image',
    likes: 2340,
    caption: 'Exploring the Andromeda nebula today 🌌 #space #adventure',
    comments: [
      { user: 'astro_fan', text: 'This is incredible! 🔥' },
      { user: 'space_cadet', text: 'Can I join next time?' },
    ],
    time: '2h ago',
    gradient: 'from-indigo-900 via-purple-900 to-pink-900',
  },
  {
    id: 2,
    user: { name: 'digital_artist', avatar: '🎨' },
    image: null,
    type: 'image',
    likes: 5600,
    caption: 'New digital painting - "Neon Dreams" 💫',
    comments: [
      { user: 'art_lover', text: 'Your best work yet!' },
    ],
    time: '5h ago',
    gradient: 'from-cyan-900 via-blue-900 to-indigo-900',
  },
  {
    id: 3,
    user: { name: 'void_musician', avatar: '🎹' },
    image: null,
    type: 'image',
    likes: 1890,
    caption: 'Studio session at 3AM hits different 🎵',
    comments: [],
    time: '8h ago',
    gradient: 'from-rose-900 via-red-900 to-orange-900',
  },
];

export default function FeedPage() {
  return (
    <div className="pt-2">
      {/* Stories bar (Instagram style) */}
      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar border-b border-slate-800">
        {['Your Story', 'cosmic', 'nebula', 'void', 'quantum', 'astro', 'pixel'].map((name, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-16 h-16 rounded-full p-0.5 ${i === 0 ? 'bg-slate-700' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'}`}>
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xl">
                {i === 0 ? '➕' : ['🌟','💫','🌙','⚡','🪐','🎯'][i-1]}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 truncate w-16 text-center">
              {i === 0 ? 'You' : name}
            </span>
          </div>
        ))}
      </div>

      {/* Feed posts */}
      <div className="space-y-4 mt-2">
        {MOCK_POSTS.map(post => (
          <article key={post.id} className="border-b border-slate-800 pb-4">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 mb-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">
                {post.user.avatar}
              </div>
              <span className="font-semibold text-sm flex-1">{post.user.name}</span>
              <button>
                <FiMoreHorizontal size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Image placeholder */}
            <div className={`aspect-square bg-gradient-to-br ${post.gradient} flex items-center justify-center mb-3`}>
              <span className="text-6xl opacity-20">📷</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 px-4 mb-2">
              <button><FiHeart size={24} /></button>
              <button><FiMessageCircle size={24} /></button>
              <button className="ml-auto"><FiBookmark size={24} /></button>
            </div>

            {/* Likes */}
            <p className="px-4 font-semibold text-sm mb-1">
              {formatCount(post.likes)} likes
            </p>

            {/* Caption */}
            <div className="px-4 text-sm">
              <span className="font-semibold mr-1">{post.user.name}</span>
              {post.caption}
            </div>

            {/* Comments */}
            {post.comments.length > 0 && (
              <div className="px-4 mt-1 space-y-0.5">
                {post.comments.map((c, i) => (
                  <p key={i} className="text-sm text-slate-400">
                    <span className="font-semibold text-slate-300 mr-1">{c.user}</span>
                    {c.text}
                  </p>
                ))}
              </div>
            )}

            {/* Time */}
            <p className="px-4 text-[11px] text-slate-500 mt-1 uppercase">{post.time}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}
