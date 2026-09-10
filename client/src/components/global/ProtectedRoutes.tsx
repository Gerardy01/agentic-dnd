import { Navigate, Outlet } from 'react-router-dom';
import useProtectedRoutes from '@/hooks/global/useProtectedRoutes';
import PageLoading from '@/components/global/PageLoading';

export default function ProtectedRoutes() {
  const { loading, isAuthenticated } = useProtectedRoutes();

  if (loading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
