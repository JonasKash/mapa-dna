import { useState, useEffect } from 'react';

interface TrackingData {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  userId: string;
  sessionId: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

export const useTracking = () => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  useEffect(() => {
    // Generate or retrieve user ID from cookie
    const getOrCreateUserId = (): string => {
      const cookieName = 'mapa_dna_user_id';
      const existingId = getCookie(cookieName);
      
      if (existingId) {
        return existingId;
      }
      
      // Generate new ID
      const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCookie(cookieName, newId, 365); // 1 year
      return newId;
    };

    // Generate session ID
    const generateSessionId = (): string => {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Get UTM parameters from URL
    const getUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        utmSource: urlParams.get('utm_source') || 'direct',
        utmMedium: urlParams.get('utm_medium') || 'none',
        utmCampaign: urlParams.get('utm_campaign') || 'none',
        utmTerm: urlParams.get('utm_term') || 'none',
        utmContent: urlParams.get('utm_content') || 'none',
      };
    };

    // Cookie helper functions
    const setCookie = (name: string, value: string, days: number) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

    const getCookie = (name: string): string | null => {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    };

    // Initialize tracking data
    const utmParams = getUrlParams();
    const trackingInfo: TrackingData = {
      ...utmParams,
      userId: getOrCreateUserId(),
      sessionId: generateSessionId(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
    };

    console.log('Tracking data initialized:', trackingInfo);
    setTrackingData(trackingInfo);
  }, []);

  return trackingData;
};
