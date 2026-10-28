import type { ErrorResponse } from '@/models/globalInterfaces';
import type { CampaignSSEStepEvent } from '@/models/campaignInterfaces';

export const catchFetchError = <T>(
  promise: Promise<T>
): Promise<[undefined, T] | [ErrorResponse]> => {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((err) => {
      const errorResponse: ErrorResponse = {
        status: err?.response?.status || 500,
        response: {
          data: err?.response?.data || {
            status: 'failed',
            message: err?.message || 'Network error',
            userMessage: '500',
          },
        },
      };
      return [errorResponse];
    });
};

const MIN_PROGRESS_PERCENT = 3;

/**
 * Overall campaign generation progress: main steps finished before the current one,
 * plus the share of the current step that its sub-progress reports as done.
 */
export const calculateCampaignProgressPercent = (event: CampaignSSEStepEvent): number => {
  const finishedSteps = Math.max(0, event.current - 1);
  const currentStepShare = event.sub && event.sub.total > 0 ? Math.min(1, event.sub.current / event.sub.total) : 0;
  const percent = Math.round(((finishedSteps + currentStepShare) / event.total) * 100);

  return Math.min(100, Math.max(MIN_PROGRESS_PERCENT, percent));
};
