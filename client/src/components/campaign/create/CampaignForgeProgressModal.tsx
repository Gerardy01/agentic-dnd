import { Modal } from 'antd';
import CampaignForgeProgress from '@/components/campaign/create/CampaignForgeProgress';

interface CampaignForgeProgressModalProps {
  open: boolean;
  percent: number;
  subPercent: number;
  step: string;
  subStep: string;
  stepCurrent: number;
  stepTotal: number;
}

export default function CampaignForgeProgressModal({ open, ...progress }: CampaignForgeProgressModalProps) {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      keyboard={false}
      centered
      width={600}
      styles={{ container: { padding: 0, background: 'transparent', boxShadow: 'none' } }}
    >
      <CampaignForgeProgress {...progress} />
    </Modal>
  );
}
