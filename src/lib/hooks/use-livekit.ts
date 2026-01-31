/**
 * LiveKit Hooks
 *
 * Custom hooks for managing LiveKit room connections.
 */

"use client";

import { useState, useCallback, useEffect } from "react";

interface UseLiveKitTokenParams {
  roomId: string;
  displayName?: string;
}

interface TokenResponse {
  token: string;
  serverUrl: string;
  roomName: string;
  participantId: string;
  participantName: string;
  isHost: boolean;
}

interface UseLiveKitTokenResult {
  token: string | null;
  serverUrl: string | null;
  isHost: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch LiveKit room token
 */
export function useLiveKitToken({
  roomId,
  displayName,
}: UseLiveKitTokenParams): UseLiveKitTokenResult {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          displayName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get room token");
      }

      const tokenData = data as TokenResponse;
      setToken(tokenData.token);
      setServerUrl(tokenData.serverUrl);
      setIsHost(tokenData.isHost);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to room");
    } finally {
      setIsLoading(false);
    }
  }, [roomId, displayName]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return {
    token,
    serverUrl,
    isHost,
    isLoading,
    error,
    refetch: fetchToken,
  };
}

/**
 * Hook for managing device permissions
 */
export function useDevicePermissions() {
  const [permissions, setPermissions] = useState<{
    camera: boolean | null;
    microphone: boolean | null;
  }>({
    camera: null,
    microphone: null,
  });
  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = useCallback(async () => {
    setIsChecking(true);

    try {
      // Check camera permission
      const cameraPermission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      // Check microphone permission
      const micPermission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      setPermissions({
        camera: cameraPermission.state === "granted",
        microphone: micPermission.state === "granted",
      });
    } catch {
      // Permissions API not supported, try to get devices
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        stream.getTracks().forEach((track) => track.stop());

        setPermissions({
          camera: true,
          microphone: true,
        });
      } catch {
        setPermissions({
          camera: false,
          microphone: false,
        });
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      setPermissions({
        camera: true,
        microphone: true,
      });

      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissions,
    isChecking,
    checkPermissions,
    requestPermissions,
  };
}

/**
 * Hook for managing available devices
 */
export function useDevices() {
  const [devices, setDevices] = useState<{
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }>({
    cameras: [],
    microphones: [],
    speakers: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshDevices = useCallback(async () => {
    setIsLoading(true);

    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();

      setDevices({
        cameras: allDevices.filter((d) => d.kind === "videoinput"),
        microphones: allDevices.filter((d) => d.kind === "audioinput"),
        speakers: allDevices.filter((d) => d.kind === "audiooutput"),
      });
    } catch (err) {
      console.error("Failed to enumerate devices:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", refreshDevices);
    };
  }, [refreshDevices]);

  return {
    devices,
    isLoading,
    refreshDevices,
  };
}
