import { useState } from 'react';
import type { CampaignDataReturn } from '@/models/campaignInterfaces';

export default function useCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignDataReturn[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);

  const handleOpenGenerateModal = () => {
    setIsGenerateModalOpen(true);
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const handleCampaignCreated = (newCampaign: CampaignDataReturn) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const handleSelectCampaign = (_campaign: CampaignDataReturn) => {
    // Reserved for when player opens an active campaign session / character creation
  };

  return {
    campaigns,
    isGenerateModalOpen,
    handleOpenGenerateModal,
    handleCloseGenerateModal,
    handleCampaignCreated,
    handleSelectCampaign,
  };
}
