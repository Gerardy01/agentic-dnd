import { useEffect, useState } from 'react';
import useToken from '@/hooks/global/useToken';

export default function useProtectedRoutes() {
  const { isLoggedIn } = useToken();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const authed = await isLoggedIn();
    setIsAuthenticated(authed);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { loading, isAuthenticated };
}
