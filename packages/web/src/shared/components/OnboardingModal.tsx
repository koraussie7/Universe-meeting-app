import { useState } from 'react';
import { FiArrowRight, FiX, FiSmartphone } from 'react-icons/fi';
import { useAppStore, createGuestProfile } from '../../shared/store/app';
import { getShortDeviceId } from '../../shared/lib/deviceFingerprint';

const AVATARS = ['🚀', '🌟', '💫', '🌙', '⚡', '🪐', '🎯', '🎨', '🎵', '👾', '🦊', '🐉'];

export default function OnboardingModal() {
  const { guestProfile, setGuestProfile, setShowOnboarding, setPage } = useAppStore();
  const [step, setStep] = useState<'splash' | 'pick-name' | 'ready'>(
    guestProfile ? 'ready' : 'splash'
  );
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  const deviceId = getShortDeviceId();

  const handleStart = () => {
    if (username.trim().length >= 2) {
      const profile = createGuestProfile(username, avatar);
      setGuestProfile(profile);
      setStep('ready');
    }
  };

  const goExplore = () => {
    setShowOnboarding(false);
    setPage('home');
  };

  // Already has profile - show quick ready screen
  if (step === 'ready') {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center px-8 max-w-sm">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-5xl mx-auto mb-6 ring-4 ring-indigo-500/20">
            {guestProfile?.avatar || '🚀'}
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-slate-400 mb-2">@{guestProfile?.username}</p>
          <p className="text-slate-500 text-sm mb-8">Your universe awaits ✨</p>
          <button
            onClick={goExplore}
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-medium w-full flex items-center justify-center gap-2"
          >
            Continue Exploring <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Splash screen
  if (step === 'splash') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center px-8">
        {/* Close button */}
        <button
          onClick={() => { setShowOnboarding(false); setPage('home'); }}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center"
        >
          <FiX size={20} className="text-slate-400" />
        </button>

        <div className="text-center max-w-sm">
          {/* Logo area */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-4xl mx-auto mb-8 rotate-6">
            ⚡
          </div>

          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Universe
          </h1>
          <p className="text-slate-400 text-lg mb-2">Explore · Create · Connect</p>
          <p className="text-slate-500 text-sm mb-6">
            No sign-up required. Just pick a name and start exploring.
          </p>

          {/* Device fingerprint indicator */}
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-2 mb-8">
            <FiSmartphone size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500 font-mono">{deviceId}</span>
            <span className="text-[10px] text-slate-600">· Your device ID</span>
          </div>

          <button
            onClick={() => setStep('pick-name')}
            className="bg-indigo-600 hover:bg-indigo-500 px-10 py-3.5 rounded-xl font-bold text-lg w-full flex items-center justify-center gap-2 transition-all"
          >
            Get Started <FiArrowRight size={20} />
          </button>

          <p className="text-slate-600 text-xs mt-6">
            By continuing, you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Pick name
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center px-8">
      <button
        onClick={() => setStep('splash')}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center"
      >
        <FiX size={20} className="text-slate-400" />
      </button>

      <div className="text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-2">Pick your name</h2>
        <p className="text-slate-400 text-sm mb-6">No email, no password. Just a name.</p>

        {/* Avatar picker */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl mx-auto mb-3">
            {avatar}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {AVATARS.slice(0, 8).map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${
                  avatar === a
                    ? 'bg-indigo-600 ring-2 ring-indigo-400 scale-110'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Username input */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_name"
            maxLength={30}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-9 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={username.trim().length < 2}
          className={`px-10 py-3.5 rounded-xl font-bold text-lg w-full flex items-center justify-center gap-2 transition-all ${
            username.trim().length >= 2
              ? 'bg-indigo-600 hover:bg-indigo-500'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Start Exploring <FiArrowRight size={20} />
        </button>

        {/* Device info */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <FiSmartphone size={12} className="text-slate-600" />
          <span className="text-[11px] text-slate-600 font-mono">Bound to device {deviceId}</span>
        </div>

        <p className="text-slate-600 text-xs mt-3">
          This profile is tied to this device. Connect email later to access anywhere.
        </p>
      </div>
    </div>
  );
}
