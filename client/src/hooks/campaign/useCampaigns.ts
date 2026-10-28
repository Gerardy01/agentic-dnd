import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignApi } from '@/api';
import type { CampaignListReturn } from '@/models/campaignInterfaces';

export default function useCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignListReturn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const [error, data] = await campaignApi.getCampaigns();
      if (!error && data) {
        setCampaigns(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  const handleSelectCampaign = (campaign: CampaignListReturn) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  return {
    campaigns,
    loading,
    handleCreateCampaign,
    handleSelectCampaign,
    fetchCampaigns,
  };
}
