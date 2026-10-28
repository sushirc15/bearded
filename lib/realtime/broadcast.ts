type EventCallback = (data: any) => void;

class RealtimeBroadcastManager {
  private subscribers: Map<string, Set<EventCallback>> = new Map();

  constructor() {
    this.subscribers.set("battle", new Set());
    this.subscribers.set("bracket", new Set());
  }

  subscribe(channel: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    const channelSubs = this.subscribers.get(channel)!;
    channelSubs.add(callback);

    return () => {
      channelSubs.delete(callback);
    };
  }

  broadcast(channel: string, data: any): void {
    const channelSubs = this.subscribers.get(channel);
    if (!channelSubs || channelSubs.size === 0) return;

    channelSubs.forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error("Broadcast callback error", err);
      }
    });
  }
}

// Global singleton to persist across Next.js dev server hot reloads
const globalForBroadcast = globalThis as unknown as {
  realtimeBroadcast: RealtimeBroadcastManager | undefined;
};

export const realtimeBroadcast =
  globalForBroadcast.realtimeBroadcast ?? new RealtimeBroadcastManager();

export const realtimeBus = realtimeBroadcast;

if (process.env.NODE_ENV !== "production") {
  globalForBroadcast.realtimeBroadcast = realtimeBroadcast;
}
