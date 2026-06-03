import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDeviceFingerprint, getShortDeviceId } from '../lib/deviceFingerprint';

export type Page = 'home' | 'shorts' | 'create' | 'subscriptions' | 'profile';
export type SidebarTab = 'home' | 'shorts' | 'subscriptions' | 'history' | 'playlist' | 'liked';

export interface GuestProfile {
  username: string;
  displayName: string;
  avatar: string;
  deviceFingerprint: string;
  deviceId: string;
  createdAt: number;
}

interface AppState {
  activePage: Page;
  setPage: (page: Page) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  isGuest: boolean;
  guestProfile: GuestProfile | null;
  setGuestProfile: (profile: GuestProfile) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  clearGuest: () => void;
  restoreProfile: () => boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activePage: 'home',
      setPage: (page) => set({ activePage: page, sidebarOpen: false }),
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      isGuest: true,
      guestProfile: null,
      setGuestProfile: (profile) => set({ guestProfile: profile, isGuest: true, showOnboarding: false }),
      showOnboarding: false,
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      clearGuest: () => set({ guestProfile: null, isGuest: true }),
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      restoreProfile: () => {
        const current = get().guestProfile;
        if (!current) return false;
        const currentFingerprint = getDeviceFingerprint();
        if (current.deviceFingerprint === currentFingerprint) return true;
        set({ guestProfile: null, isGuest: true, showOnboarding: true });
        return false;
      },
    }),
    {
      name: 'universe-device-profile',
      partialize: (state) => ({
        guestProfile: state.guestProfile,
        isGuest: state.isGuest,
      }),
    }
  )
);

export function createGuestProfile(username: string, avatar: string): GuestProfile {
  return {
    username: username.trim().toLowerCase().replace(/\s+/g, '_'),
    displayName: username.trim(),
    avatar,
    deviceFingerprint: getDeviceFingerprint(),
    deviceId: getShortDeviceId(),
    createdAt: Date.now(),
  };
}
