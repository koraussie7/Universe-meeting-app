import { useAppStore } from '../store/app';
import { 
  FiHome, FiPlay, FiCompass, FiClock, FiThumbsUp, 
  FiVideo, FiUsers, FiMusic, FiMonitor, FiGift,
  FiMenu, FiX, FiSearch
} from 'react-icons/fi';

const mainItems: { id: string; icon: any; label: string }[] = [
  { id: 'home', icon: FiHome, label: 'Home' },
  { id: 'shorts', icon: FiPlay, label: 'Shorts' },
  { id: 'subscriptions', icon: FiUsers, label: 'Subscriptions' },
] as const;

const exploreItems = [
  { id: 'history', icon: FiClock, label: 'History' },
  { id: 'playlist', icon: FiMonitor, label: 'Playlists' },
  { id: 'liked', icon: FiThumbsUp, label: 'Liked videos' },
];

const channelItems = [
  { id: 'music', icon: FiMusic, label: 'DADA Music' },
  { id: 'gaming', icon: FiGift, label: 'DADA Gaming' },
  { id: 'live', icon: FiVideo, label: 'DADA Live' },
];

export default function Sidebar() {
  const { sidebarOpen, activePage, setPage, toggleSidebar, setSidebarOpen, searchQuery, setSearchQuery } = useAppStore();

  const isCollapsed = !sidebarOpen;

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-[#0f0f0f] z-50 transition-all duration-200 flex flex-col
        ${isCollapsed ? 'w-[72px]' : 'w-[240px]'}
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Hamburger + Logo */}
        <div className="flex items-center h-14 px-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-full">
            {sidebarOpen ? <FiX size={20} className="text-white" /> : <FiMenu size={20} className="text-white" />}
          </button>
          {!isCollapsed && (
            <div className="flex items-center gap-1 ml-4">
              <FiPlay size={24} className="text-red-500" />
              <span className="text-white font-bold text-xl tracking-tight">Universe</span>
            </div>
          )}
        </div>

        {/* Search bar (collapsed mode) */}
        {isCollapsed && (
          <div className="px-3 mb-2">
            <button 
              onClick={() => { setSidebarOpen(true); }} 
              className="w-12 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl"
            >
              <FiSearch size={20} className="text-white" />
            </button>
          </div>
        )}

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto">
          <Section label={isCollapsed ? '' : ''} items={mainItems} activePage={activePage} onNav={setPage} collapsed={isCollapsed} />
          <div className="border-t border-white/10 my-2 mx-3" />
          <Section label={isCollapsed ? '' : 'You'} items={exploreItems} activePage={activePage} onNav={setPage} collapsed={isCollapsed} />
          <div className="border-t border-white/10 my-2 mx-3" />
          <Section label={isCollapsed ? '' : 'Channels'} items={channelItems} activePage={activePage} onNav={setPage} collapsed={isCollapsed} />
        </nav>
      </aside>
    </>
  );
}

function Section({ label, items, activePage, onNav, collapsed }: {
  label: string;
  items: { id: string; icon: any; label: string }[];
  activePage: string;
  onNav: (page: any) => void;
  collapsed: boolean;
}) {
  return (
    <div className="px-3 py-1">
      {label && !collapsed && (
        <div className="text-xs font-medium text-gray-400 px-3 py-2 uppercase tracking-wider">{label}</div>
      )}
      {items.map(({ id, icon: Icon, label: itemLabel }) => (
        <button
          key={id}
          onClick={() => onNav(id === 'shorts' ? 'shorts' : id)}
          className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm transition-colors
            ${activePage === id ? 'bg-white/10 font-medium text-white' : 'text-gray-300 hover:bg-white/5'}
            ${collapsed ? 'flex-col gap-1 py-3 px-0 justify-center' : ''}
          `}
        >
          <Icon size={collapsed ? 18 : 20} />
          {!collapsed && <span className="truncate">{itemLabel}</span>}
          {collapsed && <span className="text-[10px] text-gray-400">{itemLabel.split(' ')[0]}</span>}
        </button>
      ))}
    </div>
  );
}
