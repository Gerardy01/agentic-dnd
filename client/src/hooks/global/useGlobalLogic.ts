import { useEffect, useState } from 'react';
import { accountApi } from '@/api';
import useAccountStore from '@/stores/useAccountStore';

export default function useGlobalLogic() {
  const [loading, setLoading] = useState(true);
  const setAccount = useAccountStore((state) => state.setAccount);

  const fetchAccount = async () => {
    const [err, account] = await accountApi.getAccount();
    if (!err && account) {
      setAccount({
        accountId: account.id,
        username: account.username,
        email: account.email,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return { loading };
}
