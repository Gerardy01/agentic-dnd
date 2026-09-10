import useTokenStore from '@/stores/useTokenStore';
import { authApi } from '@/api';

let refreshPromise: Promise<boolean> | null = null;

export default function useToken() {
  const { accessToken, setAccessToken, removeAccessToken } = useTokenStore();

  const isLoggedIn = async (): Promise<boolean> => {
    if (accessToken) {
      return true;
    }

    // If a refresh request is already inflight, share the same promise
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const [err, data] = await authApi.refreshToken();
        if (err || !data?.accessToken) {
          removeAccessToken();
          return false;
        }

        setAccessToken(data.accessToken);
        return true;
      } catch {
        removeAccessToken();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  return {
    accessToken,
    isLoggedIn,
    removeAccessToken,
  };
}
