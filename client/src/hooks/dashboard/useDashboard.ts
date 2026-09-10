import { useNavigate } from 'react-router-dom';
import useAccountStore from '@/stores/useAccountStore';

export default function useDashboard() {
  const navigate = useNavigate();
  const { username, email, accountId } = useAccountStore();

  const handleGoToCampaigns = () => {
    navigate('/campaigns');
  };

  const handleGoToWorkshop = () => {
    navigate('/workshop');
  };

  return {
    username: username || 'Adventurer',
    email,
    accountId,
    handleGoToCampaigns,
    handleGoToWorkshop,
  };
}
