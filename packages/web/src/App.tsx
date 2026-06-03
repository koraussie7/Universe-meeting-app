import { useAppStore } from './shared/store/app';
import BottomNav from './shared/components/BottomNav';
import ReelsPage from './features/reels/ReelsPage';
import FeedPage from './features/feed/FeedPage';
import CreatePage from './features/create/CreatePage';
import MeetingPage from './features/meeting/MeetingPage';
import ProfilePage from './features/profile/ProfilePage';

export default function App() {
  const { activeTab } = useAppStore();

  const renderPage = () => {
    switch (activeTab) {
      case 'reels':   return <ReelsPage />;
      case 'feed':    return <FeedPage />;
      case 'create':  return <CreatePage />;
      case 'meeting': return <MeetingPage />;
      case 'profile': return <ProfilePage />;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen max-w-lg mx-auto relative overflow-hidden">
      <div className="pb-20">
        {renderPage()}
      </div>
      <BottomNav />
    </div>
  );
}
