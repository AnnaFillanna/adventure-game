/**
 * Adventure Game - Geolocation Service
 * Browser Geolocation API wrapper with proper error handling
 */

import type { GeoPoint, GeoError, GeoErrorCode, WatchPositionOptions } from './types';

interface GeolocationCallbacks {
  onSuccess?: (position: GeoPoint) => void;
  onError?: (error: GeoError) => void;
  onComplete?: () => void;
}

class GeolocationService {
  private watchId: number | null = null;
  private isTracking = false;
  private lastPosition: GeoPoint | null = null;
  private errorState: GeoError | null = null;

  /**
   * Check if Geolocation is supported in current browser
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'geolocation' in navigator;
  }

  /**
   * Check if HTTPS is available (required for Geolocation in production)
   */
  isHTTPS(): boolean {
    return typeof window !== 'undefined' && window.location.protocol === 'https:';
  }

  /**
   * Check if we're on localhost (allows HTTP for Geolocation)
   */
  isLocalhost(): boolean {
    return typeof window !== 'undefined' && 
           (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1');
  }

  /**
   * Check if Geolocation can be used
   */
  canUseGeolocation(): boolean {
    if (!this.isSupported()) {
      return false;
    }

    // Allow HTTP on localhost, require HTTPS in production
    if (!this.isLocalhost() && !this.isHTTPS()) {
      return false;
    }

    return true;
  }

  /**
   * Get current position once
   */
  getCurrentPosition(
    onSuccess: (position: GeoPoint) => void,
    onError: (error: GeoError) => void,
    options?: WatchPositionOptions
  ): void {
    if (!this.isSupported()) {
      onError({
        code: 'POSITION_UNAVAILABLE',
        message: 'Geolocation is not supported in this browser',
        timestamp: Date.now(),
      });
      return;
    }

    if (!this.isLocalhost() && !this.isHTTPS()) {
      onError({
        code: 'HTTPS_REQUIRED',
        message: 'Geolocation requires HTTPS (except on localhost)',
        timestamp: Date.now(),
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geoPoint: GeoPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          timestamp: position.timestamp,
        };

        this.lastPosition = geoPoint;
        this.errorState = null;
        onSuccess(geoPoint);
      },
      (error) => {
        const geoError = this.mapGeolocationError(error);
        this.errorState = geoError;
        onError(geoError);
      },
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 0,
      }
    );
  }

  /**
   * Start watching position for continuous updates
   */
  startTracking(
    onSuccess: (position: GeoPoint) => void,
    onError: (error: GeoError) => void,
    options?: WatchPositionOptions
  ): void {
    if (this.isTracking) {
      console.warn('Geolocation already tracking');
      return;
    }

    if (!this.isSupported()) {
      onError({
        code: 'POSITION_UNAVAILABLE',
        message: 'Geolocation is not supported in this browser',
        timestamp: Date.now(),
      });
      return;
    }

    if (!this.isLocalhost() && !this.isHTTPS()) {
      onError({
        code: 'HTTPS_REQUIRED',
        message: 'Geolocation requires HTTPS (except on localhost)',
        timestamp: Date.now(),
      });
      return;
    }

    this.isTracking = true;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const geoPoint: GeoPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          timestamp: position.timestamp,
        };

        this.lastPosition = geoPoint;
        this.errorState = null;
        onSuccess(geoPoint);
      },
      (error) => {
        const geoError = this.mapGeolocationError(error);
        this.errorState = geoError;
        onError(geoError);
      },
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 1000,
      }
    );
  }

  /**
   * Stop watching position
   */
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }

  /**
   * Get last known position without making a new request
   */
  getLastPosition(): GeoPoint | null {
    return this.lastPosition;
  }

  /**
   * Get last error
   */
  getLastError(): GeoError | null {
    return this.errorState;
  }

  /**
   * Check if currently tracking
   */
  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  /**
   * Map browser Geolocation errors to our error format
   */
  private mapGeolocationError(error: GeolocationPositionError): GeoError {
    let code: GeoErrorCode = 'UNKNOWN';
    let message = 'Unknown error';

    if (error.code === error.PERMISSION_DENIED) {
      code = 'PERMISSION_DENIED';
      message = 'User denied permission to access geolocation';
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      code = 'POSITION_UNAVAILABLE';
      message = 'Position information is unavailable';
    } else if (error.code === error.TIMEOUT) {
      code = 'TIMEOUT';
      message = 'The request to get user location timed out';
    }

    return {
      code,
      message: error.message || message,
      timestamp: Date.now(),
    };
  }
}

// Export singleton instance
export const geolocationService = new GeolocationService();

// Export type for use in other modules
export type { GeolocationCallbacks };
