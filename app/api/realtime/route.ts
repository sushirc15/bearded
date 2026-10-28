import { NextRequest } from "next/server";
import { realtimeBroadcast } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel") || "battle";

  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connect handshake
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ channel, status: "connected", timestamp: Date.now() })}\n\n`)
      );

      // Subscribe to broadcast events on this channel
      unsubscribe = realtimeBroadcast.subscribe(channel, (data) => {
        try {
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Client disconnected
        }
      });

      // Keep connection alive with heartbeat ping
      heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          // Closed
        }
      }, 15000);
    },
    cancel() {
      if (unsubscribe) unsubscribe();
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Encoding": "none",
    },
  });
}
