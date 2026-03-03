"use client";

import { useCallback, useState } from "react";

type GeoStatus =
  | "idle"
  | "checking-permission"
  | "requesting"
  | "granted"
  | "denied"
  | "error";

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  status: GeoStatus;
  error: string | null;
  requestLocation: () => Promise<void>;
  reset: () => void;
}

export function useGeolocation(): GeoState {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setLatitude(null);
    setLongitude(null);
    setAccuracy(null);
    setError(null);
    setStatus("idle");
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation not supported by this browser.");
      return;
    }

    try {
      setStatus("checking-permission");

      const permission = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });

      if (permission.state === "denied") {
        setStatus("denied");
        setError(
          "Location access is blocked. Please enable it in browser settings.",
        );
        return;
      }

      setStatus("requesting");

      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setAccuracy(position.coords.accuracy);
            setStatus("granted");
            resolve();
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              setStatus("denied");
              setError("Location permission denied.");
            } else if (err.code === err.TIMEOUT) {
              setStatus("error");
              setError("Location request timed out.");
            } else {
              setStatus("error");
              setError("Unable to retrieve location.");
            }
            reject(err);
          },
          {
            enableHighAccuracy: true,
            timeout: 1000000,
            maximumAge: 0,
          },
        );
      });
    } catch (err) {
      setStatus("error");
      setError("Permission check failed.");
    }
  }, []);

  return {
    latitude,
    longitude,
    accuracy,
    status,
    error,
    requestLocation,
    reset,
  };
}
