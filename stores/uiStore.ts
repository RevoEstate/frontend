import { create } from 'zustand';

type UIState = {
  isRefreshEnabled: boolean;
  toggleRefresh: () => void;
};

const useUIStore = create<UIState>((set) => ({
  isRefreshEnabled: false,
  toggleRefresh: () => set((state) => ({ isRefreshEnabled: !state.isRefreshEnabled })),
}));

export default useUIStore;
