import { useAppStore, type Page } from '../store/app';
import { FiHome, FiPlay, FiPlusSquare, FiUsers, FiUser } from 'react-icons/fi';

const tabs: { key: Page; icon: typeof FiHome; label: string }[] = [
  { key: 'home',          icon: FiHome,       label: 'Home' },
  { key: 'shorts',        icon: FiPlay,       label: 'Shorts' },
  { key: 'create',        icon: FiPlusSquare, label: '' },
  { key: 'subscriptions', icon: FiUsers,      label: 'Subs' },
  { key: 'profile',       icon: FiUser,       label: 'You' },
];

export default function BottomNav() {
  const { activePage, setPage } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/10 z-50 lg:hidden">
      <div className="flex justify-around items-center h-14">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-[48px]
              ${key === 'create' ? 'relative' : ''}`}
          >
            {key === 'create' ? (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center -mt-1">
                <Icon size={20} className="text-black" />
              </div>
            ) : (
              <Icon size={20} className={activePage === key ? 'text-white' : 'text-gray-400'} />
            )}
            {label && (
              <span className={`text-[10px] ${activePage === key ? 'text-white' : 'text-gray-400'}`}>
                {label}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
