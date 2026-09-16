import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteSettingsApi, saveSiteSettingApi } from '../services/api';

const StoreSettingsContext = createContext();

const initialSections = [
  { id: 'announcement', label: 'Announcement Bar', visible: true },
  { id: 'hero', label: 'Hero Showcase', visible: true },
  { id: 'categories', label: 'Categories Grid', visible: true },
  { id: 'featured', label: 'Featured Products', visible: true },
  { id: 'promo', label: 'Promo Banners', visible: true },
  { id: 'trust', label: 'Value Propositions', visible: true }
];

const initialHeroMedia = {
  type: 'video',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-shopping-cart-in-a-supermarket-42907-large.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  headline: 'Direct from Ghana Producers to Your Door',
  badge: 'Express 2-Hour Delivery',
  autoplay: true,
  muted: true,
  loop: true
};

const initialPolicies = {
  minOrderAmount: 50,
  businessHours: '8:00 AM - 10:00 PM GMT',
  maintenanceMode: false,
  maintenanceMessage: 'Store is currently undergoing routine inventory refresh.'
};

const initialNotifications = {
  adminPhone: '+233501234567',
  adminEmail: 'alerts@akuamarket.com',
  customerSmsEnabled: true,
  customerEmailEnabled: true,
  staffAlertsEnabled: true
};

const initialTicker = {
  text: '⚡ SAME DAY FREIGHT DELIVERY ACROSS GREATER ACCRA & TEMA | USE CODE "AKUA2026" FOR 10% OFF',
  badge: 'FLASH PROMO',
  link: '/storefront'
};

export function StoreSettingsProvider({ children }) {
  const [homepageSections, setHomepageSections] = useState(initialSections);
  const [heroMedia, setHeroMedia] = useState(initialHeroMedia);
  const [policies, setPolicies] = useState(initialPolicies);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [ticker, setTicker] = useState(initialTicker);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const data = await fetchSiteSettingsApi();
      if (data) {
        if (data.homepage_sections) setHomepageSections(data.homepage_sections);
        if (data.hero_media) setHeroMedia(data.hero_media);
        if (data.store_policies) setPolicies(data.store_policies);
        if (data.notifications) setNotifications(data.notifications);
        if (data.ticker) setTicker(data.ticker);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const updateHomepageSections = async (newSections) => {
    setHomepageSections(newSections);
    await saveSiteSettingApi('homepage_sections', newSections);
  };

  const updateHeroMedia = async (newHeroMedia) => {
    setHeroMedia(newHeroMedia);
    await saveSiteSettingApi('hero_media', newHeroMedia);
  };

  const updatePolicies = async (newPolicies) => {
    setPolicies(newPolicies);
    await saveSiteSettingApi('store_policies', newPolicies);
  };

  const updateNotifications = async (newNotifications) => {
    setNotifications(newNotifications);
    await saveSiteSettingApi('notifications', newNotifications);
  };

  const updateTicker = async (newTicker) => {
    setTicker(newTicker);
    await saveSiteSettingApi('ticker', newTicker);
  };

  return (
    <StoreSettingsContext.Provider value={{
      homepageSections,
      updateHomepageSections,
      heroMedia,
      updateHeroMedia,
      policies,
      updatePolicies,
      notifications,
      updateNotifications,
      ticker,
      updateTicker,
      loading
    }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
