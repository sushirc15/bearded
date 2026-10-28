"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseRealtimeOptions<T = any> {
  channel: "battle" | "bracket";
  onMessage: (data: T) => void;
  onReconnect?: () => void;
}

export function useRealtime<T = any>({ channel, onMessage, onReconnect }: UseRealtimeOptions<T>) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(`/api/realtime?channel=${channel}`);
    eventSourceRef.current = es;

    es.addEventListener("connected", () => {
      setIsConnected(true);
      setIsReconnecting(false);
      retryCountRef.current = 0;
      onReconnect?.();
    });

    es.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch (err) {
        console.error("Realtime JSON parse error", err);
      }
    });

    es.onerror = () => {
      setIsConnected(false);
      setIsReconnecting(true);
      es.close();

      const delay = Math.min(1000 * Math.pow(1.5, retryCountRef.current), 10000);
      retryCountRef.current += 1;

      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    };
  }, [channel, onMessage, onReconnect]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return { isConnected, isReconnecting };
}
