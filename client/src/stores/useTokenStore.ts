import { create } from 'zustand';

interface TokenState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  removeAccessToken: () => void;
}

const useTokenStore = create<TokenState>((set) => ({
  accessToken: '',
  setAccessToken: (token) => set({ accessToken: token }),
  removeAccessToken: () => set({ accessToken: '' }),
}));

export default useTokenStore;
