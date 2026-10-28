import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { campaignApi } from '@/api';
import useNotification from '@/hooks/global/useNotification';
import useStaticModal from '@/hooks/global/useStaticModal';
import useTokenStore from '@/stores/useTokenStore';
import type { CampaignDataReturn, CampaignSSEEvent, CampaignSuccessParameter } from '@/models/campaignInterfaces';

export const CAMPAIGN_MODULE_KEYS = [
  'world',
  'factions',
  'areas',
  'pois',
  'classes',
  'races',
  'npcs',
  'items',
  'spells',
] as const;

export type CampaignModuleKey = (typeof CAMPAIGN_MODULE_KEYS)[number];

export default function useCampaignContinuation(
  campaignId: number,
  initialSuccessParameter: CampaignSuccessParameter,
  onSuccess?: (campaign: CampaignDataReturn) => void
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successParameter, setSuccessParameter] = useState<CampaignSuccessParameter>(initialSuccessParameter);

  // SSE Progress state
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressCurrent, setProgressCurrent] = useState<number>(0);
  const [progressTotal, setProgressTotal] = useState<number>(13);

  const eventSourceRef = useRef<EventSource | null>(null);

  const { t } = useTranslation();
  const { successNotification } = useNotification();
  const { serverErrorModal, errorModal } = useStaticModal();

  // Close EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  // Update successParameter when prop changes
  useEffect(() => {
    setSuccessParameter(initialSuccessParameter);
  }, [initialSuccessParameter]);

  const subscribeToSSE = useCallback((processId: string) => {
    const accessToken = useTokenStore.getState().accessToken;
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const sseUrl = `${apiBase}/campaign/progress/${processId}?token=${encodeURIComponent(accessToken)}`;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload: CampaignSSEEvent = JSON.parse(event.data);

        if (payload.type === 'step') {
          setProgressStep(payload.message);
          setProgressCurrent(payload.current);
          setProgressTotal(payload.total);
          const percent = Math.min(100, Math.round((payload.current / payload.total) * 100));
          setProgressPercent(percent);
        } else if (payload.type === 'complete') {
          es.close();
          eventSourceRef.current = null;
          setProgressPercent(100);
          setLoading(false);

          // Update success parameter
          if (payload.data.successParameter) {
            setSuccessParameter(payload.data.successParameter);
          }

          const allDone = payload.data.successParameter
            ? CAMPAIGN_MODULE_KEYS.every((mod) => payload.data.successParameter?.[mod] === true)
            : true;

          if (allDone) {
            successNotification(
              t('campaigns.continueSuccessTitle'),
              t('campaigns.continueSuccessMessage')
            );
          }

          onSuccess?.(payload.data);
        } else if (payload.type === 'error') {
          es.close();
          eventSourceRef.current = null;
          setLoading(false);
          setErrorMsg(payload.message || 'Campaign continuation failed');
        }
      } catch (parseError) {
        console.error('Failed to parse SSE event payload:', parseError);
      }
    };

    es.onerror = (err) => {
      console.warn('SSE connection notice / retry:', err);
      if (es.readyState === EventSource.CLOSED && eventSourceRef.current === es) {
        es.close();
        eventSourceRef.current = null;
        setLoading(false);
        setErrorMsg(t('global.serverError'));
      }
    };
  }, [t, successNotification, onSuccess]);

  const continueCampaign = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    setProgressStep(t('campaigns.progressInitial'));
    setProgressPercent(3);
    setProgressCurrent(0);

    try {
      const [err, data] = await campaignApi.continueCampaign(campaignId, {
        successParameter,
      });

      if (err) {
        setLoading(false);
        setProgressStep('');
        setProgressPercent(0);

        if (err.status === 400 || err.status === 422) {
          setErrorMsg(err.response?.data?.message || 'Invalid parameters for campaign continuation');
          return;
        }

        if (err.status === 404) {
          setErrorMsg(err.response?.data?.userMessage || 'Campaign not found');
          return;
        }

        serverErrorModal();
        return;
      }

      if (data?.processId) {
        subscribeToSSE(data.processId);
      }
    } catch {
      setLoading(false);
      setProgressStep('');
      setProgressPercent(0);
      errorModal('Campaign Continuation Disturbance', t('global.serverError'));
    }
  }, [campaignId, successParameter, t, subscribeToSSE, serverErrorModal, errorModal]);

  const isAllSuccess = CAMPAIGN_MODULE_KEYS.every((mod) => successParameter[mod] === true);
  const firstFailedModule = CAMPAIGN_MODULE_KEYS.find((mod) => !successParameter[mod]);

  return {
    loading,
    errorMsg,
    progressStep,
    progressPercent,
    progressCurrent,
    progressTotal,
    successParameter,
    isAllSuccess,
    firstFailedModule,
    continueCampaign,
  };
}
