import { Response } from 'express';

export interface SSEProgressEvent {
  type: 'step';
  step: string;
  message: string;
  current: number;
  total: number;
}

export interface SSECompleteEvent {
  type: 'complete';
  message: string;
  data: any;
}

export interface SSEErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent = SSEProgressEvent | SSECompleteEvent | SSEErrorEvent;

interface ChannelData {
  accountId: string;
  res?: Response;
  buffer: SSEEvent[];
  ttlTimer?: NodeJS.Timeout;
}

export class SSEManager {
  private channels = new Map<string, ChannelData>();
  private readonly DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

  /**
   * Initializes a new SSE channel for a process.
   */
  initChannel(processId: string, accountId: string): void {
    const ttlTimer = setTimeout(() => {
      this.closeChannel(processId);
    }, this.DEFAULT_TTL_MS);

    this.channels.set(processId, {
      accountId,
      buffer: [],
      ttlTimer,
    });
  }

  /**
   * Connects an HTTP Response to the SSE stream.
   * Flushes any buffered events immediately.
   */
  connect(processId: string, accountId: string, res: Response): boolean {
    const channel = this.channels.get(processId);

    if (!channel) {
      return false;
    }

    if (channel.accountId !== accountId) {
      return false;
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering (Nginx, etc.)
    res.flushHeaders?.();

    channel.res = res;

    // Send initial comment to keep connection alive
    res.write(': connected\n\n');

    // Flush any events buffered before client connected
    if (channel.buffer.length > 0) {
      for (const event of channel.buffer) {
        this.writeEvent(res, event);
      }
      channel.buffer = [];
    }

    // Clean up when client disconnects
    res.on('close', () => {
      if (channel.res === res) {
        channel.res = undefined;
      }
    });

    return true;
  }

  /**
   * Emits a milestone step event (e.g. [1/11] ...) to the process channel.
   */
  emitStep(processId: string, data: Omit<SSEProgressEvent, 'type'>): void {
    const event: SSEProgressEvent = {
      type: 'step',
      ...data,
    };
    this.sendOrBuffer(processId, event);
  }

  /**
   * Emits a completion event with the generated data and closes the stream.
   */
  emitComplete(processId: string, data: any, message = 'Campaign creation complete'): void {
    const event: SSECompleteEvent = {
      type: 'complete',
      message,
      data,
    };
    this.sendOrBuffer(processId, event);

    // Close channel after giving a moment for the event to flush
    setTimeout(() => {
      this.closeChannel(processId);
    }, 500);
  }

  /**
   * Emits an error event and closes the stream.
   */
  emitError(processId: string, message: string): void {
    const event: SSEErrorEvent = {
      type: 'error',
      message,
    };
    this.sendOrBuffer(processId, event);

    // Close channel after giving a moment for the event to flush
    setTimeout(() => {
      this.closeChannel(processId);
    }, 500);
  }

  private sendOrBuffer(processId: string, event: SSEEvent): void {
    const channel = this.channels.get(processId);
    if (!channel) return;

    if (channel.res && !channel.res.writableEnded) {
      this.writeEvent(channel.res, event);
    } else {
      channel.buffer.push(event);
    }
  }

  private writeEvent(res: Response, event: SSEEvent): void {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }

  /**
   * Closes and removes the channel.
   */
  closeChannel(processId: string): void {
    const channel = this.channels.get(processId);
    if (!channel) return;

    if (channel.ttlTimer) {
      clearTimeout(channel.ttlTimer);
    }

    if (channel.res && !channel.res.writableEnded) {
      channel.res.end();
    }

    this.channels.delete(processId);
  }
}

export const sseManager = new SSEManager();
