import { create } from 'zustand';
import type { AccountStateDTO } from '@/models/accountInterfaces';

interface AccountState {
  accountId: string;
  username: string;
  email: string;
  setAccount: (account: AccountStateDTO) => void;
  removeAccount: () => void;
  setUsername: (username: string) => void;
}

const useAccountStore = create<AccountState>((set) => ({
  accountId: '',
  username: '',
  email: '',
  setAccount: (account: AccountStateDTO) => set({ ...account }),
  removeAccount: () => set({ accountId: '', username: '', email: '' }),
  setUsername: (username: string) => set({ username }),
}));

export default useAccountStore;
