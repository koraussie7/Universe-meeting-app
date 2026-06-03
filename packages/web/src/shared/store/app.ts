import { create } from 'zustand';

export type Tab = 'reels' | 'feed' | 'create' | 'meeting' | 'profile';

interface AppState {
  activeTab: Tab;
  setTab: (tab: Tab) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'reels',
  setTab: (tab) => set({ activeTab: tab }),
}));
