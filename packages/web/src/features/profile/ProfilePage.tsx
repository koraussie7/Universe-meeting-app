import { FiGrid, FiLock, FiSettings, FiBarChart2, FiVideo } from 'react-icons/fi';

const PROFILE = {
  name: 'cosmic_explorer',
  displayName: 'Cosmic Explorer 🌌',
  avatar: '🚀',
  bio: 'Exploring the universe one meeting at a time ✨\nCreator · Streamer · Dreamer',
  posts: 42,
  followers: 3840,
  following: 217,
  isLive: true,
};

export default function ProfilePage() {
  return (
    <div className="pt-4">
      {/* Profile header */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl ring-2 ring-indigo-500/30">
            {PROFILE.avatar}
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="font-bold text-lg">{PROFILE.posts}</p>
              <p className="text-xs text-slate-400">Posts</p>
            </div>
            <div>
              <p className="font-bold text-lg">{formatCount(PROFILE.followers)}</p>
              <p className="text-xs text-slate-400">Followers</p>
            </div>
            <div>
              <p className="font-bold text-lg">{PROFILE.following}</p>
              <p className="text-xs text-slate-400">Following</p>
            </div>
          </div>
        </div>

        <p className="font-bold text-sm">{PROFILE.displayName}</p>
        <p className="text-slate-400 text-sm mt-1 whitespace-pre-line">{PROFILE.bio}</p>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-slate-800 border border-slate-700 rounded-lg py-2 text-sm font-medium">
            Edit Profile
          </button>
          <button className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <FiSettings size={18} />
          </button>
        </div>
      </div>

      {/* Live indicator */}
      {PROFILE.isLive && (
        <div className="mt-4 mx-4 bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-800/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="font-medium text-sm">LIVE NOW</span>
          <span className="text-slate-400 text-sm ml-auto">Join →</span>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-t border-slate-800 mt-4">
        <button className="flex-1 py-3 flex justify-center border-b-2 border-indigo-400">
          <FiGrid size={20} className="text-indigo-400" />
        </button>
        <button className="flex-1 py-3 flex justify-center border-b-2 border-transparent">
          <FiVideo size={20} className="text-slate-500" />
        </button>
        <button className="flex-1 py-3 flex justify-center border-b-2 border-transparent">
          <FiBarChart2 size={20} className="text-slate-500" />
        </button>
        <button className="flex-1 py-3 flex justify-center border-b-2 border-transparent">
          <FiLock size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Grid placeholder */}
      <div className="grid grid-cols-3 gap-0.5 mt-0.5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className={`aspect-square bg-gradient-to-br ${
            ['from-indigo-900 to-purple-900',
             'from-pink-900 to-rose-900',
             'from-emerald-900 to-teal-900',
             'from-blue-900 to-cyan-900',
             'from-orange-900 to-amber-900',
             'from-violet-900 to-fuchsia-900',
             'from-cyan-900 to-sky-900',
             'from-rose-900 to-pink-900',
             'from-teal-900 to-green-900'][i]
          } flex items-center justify-center`}>
            <span className="text-2xl opacity-20">
              {['🌟','💫','🎨','🎵','📸','🌙','⚡','🪐','🎯'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}
