import { useEffect } from 'react';
import { useAppStore } from './shared/store/app';
import Sidebar from './shared/components/Sidebar';
import OnboardingModal from './shared/components/OnboardingModal';
import HomePage from './features/home/HomePage';
import ShortsPage from './features/shorts/ShortsPage';
import CreatePage from './features/create/CreatePage';
import SubscribePage from './features/subscribe/SubscribePage';
import ProfilePage from './features/profile/ProfilePage';
import FeedPage from './features/feed/FeedPage';
import MeetingPage from './features/meeting/MeetingPage';
import BottomNav from './shared/components/BottomNav';

export default function App() {
  const { activePage, guestProfile, showOnboarding, setShowOnboarding, restoreProfile } = useAppStore();

  useEffect(() => {
    if (guestProfile) {
      const isValid = restoreProfile();
      if (!isValid) setShowOnboarding(true);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  if (showOnboarding || !guestProfile) {
    return (
      <div className="bg-black text-white min-h-screen w-full overflow-hidden">
        <OnboardingModal />
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':          return <HomePage />;
      case 'shorts':        return <ShortsPage />;
      case 'create':        return <CreatePage />;
      case 'subscriptions': return <SubscribePage />;
      case 'profile':       return <ProfilePage />;
      default:              return <HomePage />;
    }
  };

  // Desktop: sidebar + content
  // Mobile: bottom nav + content
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen w-full">
      {/* Desktop layout */}
      <div className="hidden lg:flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          {renderPage()}
        </main>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <div className="pb-16">
          {renderPage()}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
