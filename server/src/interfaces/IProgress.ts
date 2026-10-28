/**
 * Fine-grained progress of the step that is currently running (e.g. "class 3 of 10").
 * `current` may be fractional when the total is not known upfront; `current / total` is the step completion ratio.
 */
export type GenerationProgress = {
  message: string;
  current: number;
  total: number;
};

export type GenerationProgressCallback = (progress: GenerationProgress) => void;
