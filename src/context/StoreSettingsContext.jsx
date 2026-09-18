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

export const defaultHeroSlides = [
  {
    id: 1,
    title: 'Slide 1: Supermarket Aisles',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-shopping-cart-in-a-supermarket-42907-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    headline: 'Direct from Ghana Producers to Your Door',
    badge: 'Express 2-Hour Delivery',
    badgeColor: 'emerald',
    subheadline: 'Skip supermarket markups. Buy single items, wholesale cartons, or distributor pallets with instant Paystack Mobile Money settlement.',
    ctaText: 'Shop Wholesale Catalog',
    ctaSecondaryText: 'Track Freight Order',
    tint: 'emerald',
    opacity: 65
  },
  {
    id: 2,
    title: 'Slide 2: Farm Produce Harvests',
    type: 'image',
    videoUrl: '',
    posterUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    headline: 'Farm-Fresh Harvests at Direct Wholesale Rates',
    badge: 'Daily Fresh Stock',
    badgeColor: 'amber',
    subheadline: 'Sourced directly from certified regional farmer co-operatives across Greater Accra and Ashanti regions.',
    ctaText: 'Explore Fresh Groceries',
    ctaSecondaryText: 'View Price List',
    tint: 'amber',
    opacity: 55
  },
  {
    id: 3,
    title: 'Slide 3: Tech Mall Displays',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-kitchen-41584-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
    headline: 'Commercial Displays & Premium Home Electronics',
    badge: 'Factory Direct Tech',
    badgeColor: 'indigo',
    subheadline: 'Official manufacturer warranties on 4K Smart TVs, commercial crate displays, and high-performance audio systems.',
    ctaText: 'Shop Tech Mall',
    ctaSecondaryText: 'Request RFQ',
    tint: 'indigo',
    opacity: 70
  }
];

const initialHeroMedia = {
  type: 'video',
  videoUrl: defaultHeroSlides[0].videoUrl,
  posterUrl: defaultHeroSlides[0].posterUrl,
  headline: defaultHeroSlides[0].headline,
  badge: defaultHeroSlides[0].badge,
  badgeColor: defaultHeroSlides[0].badgeColor,
  subheadline: defaultHeroSlides[0].subheadline,
  ctaText: defaultHeroSlides[0].ctaText,
  ctaSecondaryText: defaultHeroSlides[0].ctaSecondaryText,
  autoplay: true,
  muted: true,
  loop: true,
  rotationInterval: 60, // 60 seconds auto-rotation
  autoRotate: true,
  slides: defaultHeroSlides
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
  text: 'SAME DAY FREIGHT DELIVERY ACROSS GREATER ACCRA & TEMA | USE CODE "AKUA2026" FOR 10% OFF',
  badge: 'FLASH PROMO',
  link: '/storefront'
};

export function StoreSettingsProvider({ children }) {
  const [homepageSections, setHomepageSections] = useState(initialSections);
  const [heroMedia, setHeroMedia] = useState(() => {
    try {
      const cached = localStorage.getItem('akua_hero_media');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return initialHeroMedia;
  });
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
        if (data.hero_media) {
          const loaded = data.hero_media;
          if (!loaded.slides || loaded.slides.length === 0) {
            loaded.slides = [...defaultHeroSlides];
          }
          if (loaded.rotationInterval === undefined) loaded.rotationInterval = 60;
          if (loaded.autoRotate === undefined) loaded.autoRotate = true;
          setHeroMedia(loaded);
          try {
            localStorage.setItem('akua_hero_media', JSON.stringify(loaded));
          } catch (e) {}
        }
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
    try {
      localStorage.setItem('akua_hero_media', JSON.stringify(newHeroMedia));
    } catch (e) {}
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
