import { useAppStore, type Tab } from '../store/app';
import { 
  FiVideo, FiHome, FiPlusSquare, FiCamera, FiUser 
} from 'react-icons/fi';

const tabs: { key: Tab; icon: typeof FiVideo; label: string }[] = [
  { key: 'reels',   icon: FiVideo,      label: 'Reels' },
  { key: 'feed',    icon: FiHome,       label: 'Feed' },
  { key: 'create',  icon: FiPlusSquare, label: 'Create' },
  { key: 'meeting', icon: FiCamera,     label: 'Live' },
  { key: 'profile', icon: FiUser,       label: 'Profile' },
];

export default function BottomNav() {
  const { activeTab, setTab } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-slate-800 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex flex-col items-center gap-0.5 px-4 py-1"
          >
            <Icon size={24} className={activeTab === key ? 'text-indigo-400' : 'text-slate-500'} />
            <span className={'text-[10px] font-medium ' + (activeTab === key ? 'text-indigo-400' : 'text-slate-500')}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
