import { Outlet } from 'react-router-dom';
import useGlobalLogic from '@/hooks/global/useGlobalLogic';
import PageLoading from '@/components/global/PageLoading';

export default function GlobalLogic() {
  const { loading } = useGlobalLogic();

  if (loading) {
    return <PageLoading />;
  }

  return <Outlet />;
}
