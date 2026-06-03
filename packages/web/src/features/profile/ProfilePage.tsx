import { FiGrid, FiLock, FiSettings, FiBarChart2, FiVideo, FiLogOut, FiSmartphone } from 'react-icons/fi';
import { useAppStore } from '../../shared/store/app';

export default function ProfilePage() {
  const { guestProfile, clearGuest, setShowOnboarding } = useAppStore();

  const PROFILE = {
    name: guestProfile?.username || 'guest',
    displayName: guestProfile?.displayName || 'Guest Explorer',
    avatar: guestProfile?.avatar || '🚀',
    bio: 'Exploring the universe one post at a time ✨\nNo account needed — just vibes.',
    posts: 0,
    followers: 0,
    following: 0,
    isLive: false,
  };

  const handleSwitchAccount = () => {
    clearGuest();
    setShowOnboarding(true);
  };

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

        <p className="font-bold text-sm">@{PROFILE.name}</p>
        <p className="font-bold text-sm mt-0.5">{PROFILE.displayName}</p>
        <p className="text-slate-400 text-sm mt-1 whitespace-pre-line">{PROFILE.bio}</p>

        {/* Guest badge */}
        <div className="inline-flex items-center gap-1.5 mt-2 bg-indigo-900/30 border border-indigo-800/40 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[11px] text-indigo-300 font-medium">Guest Mode</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-slate-800 border border-slate-700 rounded-lg py-2 text-sm font-medium">
            Edit Profile
          </button>
          <button className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <FiSettings size={18} />
          </button>
        </div>
      </div>

      {/* Device binding card */}
      <div className="mt-4 mx-4 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiSmartphone size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Device Binding</span>
        </div>
        <p className="text-xs text-slate-500 mb-1">
          This profile is bound to this device.
        </p>
        {guestProfile && (
          <div className="flex items-center gap-2 mt-2">
            <code className="text-[11px] bg-slate-900 px-2 py-1 rounded font-mono text-slate-400">
              {guestProfile.deviceId}
            </code>
            <span className="text-[10px] text-slate-600">
              Created {new Date(guestProfile.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Guest mode info card */}
      <div className="mt-3 mx-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/20 rounded-xl p-4">
        <p className="text-sm font-medium mb-1">💡 Connect your account</p>
        <p className="text-xs text-slate-400 mb-3">
          Connect email to sync across devices and never lose your profile.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium w-full">
          Connect Email
        </button>
      </div>

      {/* Switch account */}
      <div className="mx-4 mt-2">
        <button
          onClick={handleSwitchAccount}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-300 text-xs py-2 transition-colors"
        >
          <FiLogOut size={14} />
          Create new profile on this device
        </button>
      </div>

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

      {/* Empty state - no posts yet */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <FiVideo size={28} className="text-slate-500" />
        </div>
        <p className="font-bold text-lg mb-1">No posts yet</p>
        <p className="text-slate-400 text-sm text-center">
          Start sharing your universe! Tap the + button to create your first post.
        </p>
      </div>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}
