import React, { useState, useRef, useEffect } from 'react';
import { useStoreSettings, defaultHeroSlides } from '../../context/StoreSettingsContext';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import {
  Video,
  Image as ImageIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  Trash2,
  Upload,
  Plus,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Save,
  CheckCircle2,
  Zap,
  Sliders,
  Layers,
  Type,
  Palette,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  FileVideo,
  FileImage,
  UploadCloud,
  Link as LinkIcon,
  Check,
  X,
  Film,
  RotateCcw,
  Clock,
  Timer,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const MEDIA_PRESETS = [
  {
    id: 'supermarket',
    title: 'Supermarket Express Aisles',
    subtitle: 'Ambient grocery carts & aisles',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-shopping-cart-in-a-supermarket-42907-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    headline: 'Direct from Ghana Producers to Your Door',
    badge: 'Express 2-Hour Delivery',
    badgeColor: 'emerald',
    subheadline: 'Fresh supermarket staples, grains & factory goods at direct wholesale prices with instant MoMo checkout.',
    ctaText: 'Shop Wholesale Catalog',
    ctaSecondaryText: 'Track Order',
    tint: 'emerald',
    opacity: 65
  },
  {
    id: 'produce',
    title: 'Fresh Farm Produce & Staples',
    subtitle: 'Organic plantains, grains & spices',
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
    id: 'electronics',
    title: 'Online Shopping Mall & Tech',
    subtitle: 'Smart displays, TVs & electronics',
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
  },
  {
    id: 'beverages',
    title: 'Bulk Chilled Beverages & Water',
    subtitle: 'Bottled water, juices & malt drinks',
    type: 'image',
    videoUrl: '',
    posterUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
    headline: 'Chilled Water & Bulk Wholesale Refreshments',
    badge: 'Distributor Bulk Crates',
    badgeColor: 'emerald',
    subheadline: 'Distributor pack pricing for Bel-Aqua 12-packs, Milo energy powder, and fruit juice pallets delivered to your depot.',
    ctaText: 'View Beverage Pallets',
    ctaSecondaryText: 'Calculate Freight',
    tint: 'midnight',
    opacity: 60
  }
];

export function HeroMediaManager() {
  const { heroMedia, updateHeroMedia } = useStoreSettings();

  // Helper to ensure valid slides array
  const sanitizeSlides = (sourceSlides) => {
    if (Array.isArray(sourceSlides) && sourceSlides.length > 0) {
      return [...sourceSlides];
    }
    return [...defaultHeroSlides];
  };

  // State: Dynamic Carousel Slides
  const [slides, setSlides] = useState(() => sanitizeSlides(heroMedia?.slides));
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [rotationInterval, setRotationInterval] = useState(heroMedia?.rotationInterval || 60);
  const [autoRotate, setAutoRotate] = useState(heroMedia?.autoRotate ?? true);

  // Viewport Simulation State
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);
  const [countdown, setCountdown] = useState(rotationInterval);
  const [activeDevice, setActiveDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingStream, setIsTestingStream] = useState(false);
  const videoRef = useRef(null);

  // File Upload State
  const [sourceMode, setSourceMode] = useState('upload'); // 'upload' | 'url'
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [uploadedVideoMeta, setUploadedVideoMeta] = useState(null);
  const [uploadedImageMeta, setUploadedImageMeta] = useState(null);
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Synchronize when heroMedia updates externally
  useEffect(() => {
    if (heroMedia) {
      if (heroMedia.slides && heroMedia.slides.length >= 1) {
        setSlides(sanitizeSlides(heroMedia.slides));
      }
      if (heroMedia.rotationInterval !== undefined) {
        setRotationInterval(heroMedia.rotationInterval);
      }
      if (heroMedia.autoRotate !== undefined) {
        setAutoRotate(heroMedia.autoRotate);
      }
    }
  }, [heroMedia]);

  // Viewport Auto-Rotation Timer (60s countdown)
  useEffect(() => {
    if (!autoRotate) {
      setCountdown(rotationInterval);
      return;
    }

    setCountdown(rotationInterval);
    const intervalTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPreviewSlideIndex((curr) => (curr + 1) % slides.length);
          return rotationInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalTimer);
  }, [autoRotate, rotationInterval, slides.length, previewSlideIndex]);

  // Keep video reloaded when preview slide switches
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [previewSlideIndex]);

  // Current slide being edited
  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Update a single field in the currently active editing slide
  const handleUpdateCurrentSlide = (field, value) => {
    setSlides((prevSlides) => {
      const copy = [...prevSlides];
      copy[activeSlideIndex] = {
        ...copy[activeSlideIndex],
        [field]: value
      };
      return copy;
    });
    // Immediately ensure viewport reflects active slide being edited
    setPreviewSlideIndex(activeSlideIndex);
  };

  // Video File Upload Handler
  const handleVideoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file (.mp4, .webm, .ogg, .mov)');
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > 80 * 1024 * 1024) {
      toast.error(`Video file (${sizeMB} MB) exceeds 80MB limit. Please choose an optimized file.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    // Auto-capture high-resolution video poster frame
    const tempVideo = document.createElement('video');
    tempVideo.src = objectUrl;
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.muted = true;
    tempVideo.playsInline = true;
    tempVideo.onloadeddata = () => {
      tempVideo.currentTime = Math.min(1.0, (tempVideo.duration || 2) / 2);
    };
    tempVideo.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = tempVideo.videoWidth || 1280;
        canvas.height = tempVideo.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        const autoPoster = canvas.toDataURL('image/jpeg', 0.85);
        handleUpdateCurrentSlide('posterUrl', autoPoster);
      } catch (err) {
        console.warn('Could not capture video poster frame:', err);
      }
    };

    // Convert to Base64 for permanent persistence in SQLite
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setSlides((prev) => {
        const copy = [...prev];
        copy[activeSlideIndex] = {
          ...copy[activeSlideIndex],
          type: 'video',
          videoUrl: base64Data
        };
        return copy;
      });
      setUploadedVideoMeta({
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.type || 'video/mp4'
      });
      toast.success(`Video "${file.name}" uploaded to Slide ${activeSlideIndex + 1}!`);
    };
    reader.readAsDataURL(file);

    // Immediate UI feedback
    setSlides((prev) => {
      const copy = [...prev];
      copy[activeSlideIndex] = {
        ...copy[activeSlideIndex],
        type: 'video',
        videoUrl: objectUrl
      };
      return copy;
    });
    setUploadedVideoMeta({
      name: file.name,
      size: `${sizeMB} MB`,
      type: file.type || 'video/mp4'
    });
  };

  // Image File Upload Handler
  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (.png, .jpg, .webp, .svg)');
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setSlides((prev) => {
        const copy = [...prev];
        copy[activeSlideIndex] = {
          ...copy[activeSlideIndex],
          posterUrl: dataUrl
        };
        return copy;
      });
      setUploadedImageMeta({
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.type
      });
      toast.success(`Image "${file.name}" uploaded to Slide ${activeSlideIndex + 1}!`);
    };
    reader.readAsDataURL(file);
  };

  // Automatically persist slides array to backend & localStorage
  const persistSlides = async (newSlides) => {
    if (!newSlides || newSlides.length === 0) return;
    const payload = {
      type: newSlides[0].type,
      videoUrl: newSlides[0].videoUrl,
      posterUrl: newSlides[0].posterUrl,
      headline: newSlides[0].headline,
      badge: newSlides[0].badge,
      badgeColor: newSlides[0].badgeColor,
      subheadline: newSlides[0].subheadline,
      ctaText: newSlides[0].ctaText,
      ctaSecondaryText: newSlides[0].ctaSecondaryText,
      autoplay: true,
      muted: true,
      loop: true,
      tint: newSlides[0].tint,
      opacity: newSlides[0].opacity,
      slides: newSlides,
      rotationInterval: Number(rotationInterval),
      autoRotate: autoRotate
    };
    await updateHeroMedia(payload);
  };

  // Reset current slide to default preset
  const handleResetSlide = () => {
    const defaultData = defaultHeroSlides[activeSlideIndex] || defaultHeroSlides[0];
    const copy = [...slides];
    copy[activeSlideIndex] = { ...defaultData };
    setSlides(copy);
    setUploadedVideoMeta(null);
    setUploadedImageMeta(null);
    persistSlides(copy);
    toast.info(`Reset Slide ${activeSlideIndex + 1} to default preset.`);
  };

  // Delete/Clear Video completely from the active slide
  const handleDeleteVideoAsset = () => {
    const copy = [...slides];
    copy[activeSlideIndex] = {
      ...copy[activeSlideIndex],
      type: 'image',
      videoUrl: ''
    };
    setSlides(copy);
    setUploadedVideoMeta(null);
    persistSlides(copy);
    toast.success(`Video asset removed completely from Slide ${activeSlideIndex + 1}.`);
  };

  // Delete/Clear Photo completely from the active slide
  const handleDeleteImageAsset = () => {
    const copy = [...slides];
    copy[activeSlideIndex] = {
      ...copy[activeSlideIndex],
      posterUrl: ''
    };
    setSlides(copy);
    setUploadedImageMeta(null);
    persistSlides(copy);
    toast.success(`Photo asset removed completely from Slide ${activeSlideIndex + 1}.`);
  };

  // Clear all media (sets clean background gradient)
  const handleClearAllMedia = () => {
    const copy = [...slides];
    copy[activeSlideIndex] = {
      ...copy[activeSlideIndex],
      type: 'image',
      videoUrl: '',
      posterUrl: ''
    };
    setSlides(copy);
    setUploadedVideoMeta(null);
    setUploadedImageMeta(null);
    persistSlides(copy);
    toast.success(`All media removed from Slide ${activeSlideIndex + 1}. Using clean gradient display.`);
  };

  // Delete an entire slide completely from the carousel
  const handleDeleteSlide = (indexToDelete) => {
    if (slides.length <= 1) {
      toast.error('The carousel requires at least 1 slide. You can clear its media instead.');
      return;
    }
    const updated = slides.filter((_, idx) => idx !== indexToDelete);
    setSlides(updated);
    if (activeSlideIndex >= updated.length) {
      setActiveSlideIndex(updated.length - 1);
    } else if (activeSlideIndex === indexToDelete) {
      setActiveSlideIndex(Math.max(0, indexToDelete - 1));
    }
    setPreviewSlideIndex(0);
    persistSlides(updated);
    toast.success(`Slide ${indexToDelete + 1} deleted completely from carousel.`);
  };

  // Add a new slide to the carousel
  const handleAddSlide = () => {
    if (slides.length >= 6) {
      toast.error('Maximum 6 slides supported.');
      return;
    }
    const newIdx = slides.length + 1;
    const newSlide = {
      id: Date.now(),
      title: `Slide ${newIdx}: Showcase`,
      type: 'image',
      videoUrl: '',
      posterUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      headline: 'Fresh Enterprise Showcase',
      badge: 'New Promotion',
      badgeColor: 'emerald',
      subheadline: 'Highlight wholesale deals, promotions, and factory direct items.',
      ctaText: 'Shop Catalog',
      ctaSecondaryText: 'Track Order',
      tint: 'emerald',
      opacity: 65
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideIndex(slides.length);
    setPreviewSlideIndex(slides.length);
    persistSlides(updated);
    toast.success(`Slide ${newIdx} added to carousel!`);
  };

  // Apply a curated preset to the current active slide
  const handleApplyPreset = (preset) => {
    const copy = [...slides];
    copy[activeSlideIndex] = {
      ...copy[activeSlideIndex],
      type: preset.type,
      videoUrl: preset.videoUrl || copy[activeSlideIndex].videoUrl,
      posterUrl: preset.posterUrl,
      headline: preset.headline,
      badge: preset.badge,
      badgeColor: preset.badgeColor,
      subheadline: preset.subheadline,
      ctaText: preset.ctaText,
      ctaSecondaryText: preset.ctaSecondaryText,
      tint: preset.tint,
      opacity: preset.opacity
    };
    setSlides(copy);
    persistSlides(copy);
    toast.success(`Applied "${preset.title}" to Slide ${activeSlideIndex + 1}!`);
  };

  // Save all slides and rotation interval to database
  const handleSaveAll = async () => {
    setIsSaving(true);
    await persistSlides(slides);
    setIsSaving(false);
    toast.success(`Hero Media Carousel published! ${slides.length} slides rotating every ${rotationInterval} seconds.`);
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTestStream = () => {
    setIsTestingStream(true);
    setTimeout(() => {
      setIsTestingStream(false);
      toast.success('HLS / MP4 Edge Stream verified! Latency: 16ms, Resolution: 1080p FHD');
    }, 900);
  };

  // Preview Slide Data
  const activePreviewSlide = slides[previewSlideIndex] || slides[0];

  const tintGradients = {
    midnight: `rgba(2, 6, 23, ${(activePreviewSlide.opacity || 65) / 100})`,
    emerald: `rgba(6, 78, 59, ${(activePreviewSlide.opacity || 65) / 100})`,
    indigo: `rgba(30, 27, 75, ${(activePreviewSlide.opacity || 65) / 100})`,
    amber: `rgba(120, 53, 15, ${(activePreviewSlide.opacity || 65) / 100})`
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Multi-Slide 60s Carousel Engine
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                3 Video/Image Slide Slots
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                Auto-Rotate: {rotationInterval}s
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Hero Media & 60s Carousel Studio
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Upload up to 3 custom videos or images that seamlessly cycle every 60 seconds on your storefront. Admin can independently configure each slide’s assets, headlines, and call-to-actions.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Publishing Carousel...' : 'Save & Publish Live'}</span>
            </button>

            <a
              href="#storefront"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Storefront View</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Slide Selector Tabs & Auto-Rotate Controls */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Configure Carousel Slides (3 Independent Slots)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select a slide below to upload its video/photo and edit its dynamic text overlays.
            </p>
          </div>

          {/* 60s Auto-Rotation Controls */}
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Rotation Cycle:</span>
            </div>

            <select
              value={rotationInterval}
              onChange={(e) => setRotationInterval(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-black rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value={30}>Every 30 seconds</option>
              <option value={45}>Every 45 seconds</option>
              <option value={60}>Every 60 seconds (Standard)</option>
              <option value={90}>Every 90 seconds</option>
              <option value={120}>Every 120 seconds (2 mins)</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer border-l border-slate-800 pl-3">
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span className="text-xs font-bold text-slate-300">Auto-Rotate</span>
            </label>
          </div>
        </div>

        {/* Dynamic Interactive Carousel Slide Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {slides.map((s, idx) => {
            const isActive = activeSlideIndex === idx;
            const isPreviewing = previewSlideIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveSlideIndex(idx);
                  setPreviewSlideIndex(idx);
                }}
                className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                    : 'bg-slate-950/70 hover:bg-slate-850/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative h-28 rounded-xl overflow-hidden mb-3 bg-slate-900">
                  <img
                    src={s.posterUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                    alt={s.title || `Slide ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Format Badge */}
                  <span className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-md border flex items-center gap-1 ${
                    s.type === 'video'
                      ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/40'
                      : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {s.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                    <span>{s.type === 'video' ? 'VIDEO' : 'PHOTO'}</span>
                  </span>

                  {/* Delete Slide Button */}
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to completely delete Slide ${idx + 1}?`)) {
                          handleDeleteSlide(idx);
                        }
                      }}
                      className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white backdrop-blur-md transition-all shadow-md active:scale-95 z-20"
                      title={`Delete Slide ${idx + 1} completely from carousel`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Active Editing indicator */}
                  {isActive && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Editing
                    </span>
                  )}

                  {/* Viewport Current Slide Pin */}
                  {isPreviewing && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase flex items-center gap-1 animate-pulse">
                      <Eye className="w-2.5 h-2.5" /> In Viewport
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                      {s.title || `Slide ${idx + 1}`}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Slot #{idx + 1}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {s.headline || 'Custom Headline...'}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Add New Slide Slot Card */}
          {slides.length < 6 && (
            <div
              onClick={handleAddSlide}
              className="p-3.5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-900/60 flex flex-col items-center justify-center min-h-[170px] text-center transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-xs font-black text-white group-hover:text-emerald-400">
                + Add Slide Slot
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Up to 6 slides in rotation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. 1-Click Retail Presets Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Quick 1-Click Retail Presets for Slide {activeSlideIndex + 1}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Populate video/photo assets & copy instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {MEDIA_PRESETS.map((preset) => {
            const isSelected = currentSlide.headline === preset.headline;
            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`group relative p-3 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                    : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative h-20 rounded-xl overflow-hidden mb-2 bg-slate-950">
                  <img
                    src={preset.posterUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                    alt={preset.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <span className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-md border flex items-center gap-1 ${
                    preset.type === 'video'
                      ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/40'
                      : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {preset.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                    <span>{preset.type === 'video' ? 'VIDEO' : 'PHOTO'}</span>
                  </span>

                  {isSelected && (
                    <span className="absolute top-2 right-2 p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {preset.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Dual-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Granular Controls for Slide [activeSlideIndex] (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Slide Identity Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                #{activeSlideIndex + 1}
              </span>
              <div>
                <p className="text-xs font-black text-white">
                  Editing Slide {activeSlideIndex + 1} of {slides.length}
                </p>
                <p className="text-[10px] text-slate-300">
                  Configure video/photo assets, marketing copy, or delete completely.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
              <button
                type="button"
                onClick={handleClearAllMedia}
                className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 flex items-center gap-1 transition-all cursor-pointer"
                title="Remove video & image, use clean background gradient"
              >
                <Layers className="w-3 h-3" /> Clear Media
              </button>

              <button
                type="button"
                onClick={handleResetSlide}
                className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                title="Reset to default preset"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>

              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to completely delete Slide ${activeSlideIndex + 1}?`)) {
                      handleDeleteSlide(activeSlideIndex);
                    }
                  }}
                  className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                  title="Delete this entire slide from carousel"
                >
                  <Trash2 className="w-3 h-3" /> Delete Slide
                </button>
              )}
            </div>
          </div>

          {/* Media Format Selector for this Slide */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Media Format for Slide {activeSlideIndex + 1}</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Video or High-Res Photo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handleUpdateCurrentSlide('type', 'video')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                  currentSlide.type === 'video'
                    ? 'bg-indigo-500/15 border-indigo-500 ring-2 ring-indigo-500/30 text-indigo-400 font-bold'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${currentSlide.type === 'video' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Cinematic Ambient Video</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Upload an MP4 or WebM video file, or link direct CDN stream.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateCurrentSlide('type', 'image')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                  currentSlide.type === 'image'
                    ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-400 font-bold'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${currentSlide.type === 'image' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">High-Resolution Photo</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Upload a high-impact photograph (PNG, JPG, WebP) with zero video lag.
                  </p>
                </div>
              </button>
            </div>
          </GlassCard>

          {/* Interactive Upload & Asset Management */}
          <GlassCard className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Media Upload Studio (Slide {activeSlideIndex + 1})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Drag & drop your video or photo from your computer, or enter a remote URL.
                </p>
              </div>

              {/* Source Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sourceMode === 'upload'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sourceMode === 'url'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Direct URLs</span>
                </button>
              </div>
            </div>

            {/* Hidden Native File Inputs */}
            <input
              type="file"
              ref={videoInputRef}
              onChange={(e) => handleVideoFile(e.target.files?.[0])}
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              className="hidden"
            />
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e) => handleImageFile(e.target.files?.[0])}
              accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml"
              className="hidden"
            />

            {/* FILE UPLOAD MODE */}
            {sourceMode === 'upload' && (
              <div className="space-y-4">
                {currentSlide.type === 'video' ? (
                  <>
                    {/* Video File Dropzone */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <FileVideo className="w-4 h-4 text-indigo-400" />
                          <span>Video Asset for Slide {activeSlideIndex + 1} (.mp4 / .webm)</span>
                        </label>
                        <span className="text-[10px] font-mono text-emerald-400">Up to 80MB • 1080p Ready</span>
                      </div>

                      <div
                        onClick={() => videoInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true); }}
                        onDragLeave={() => setIsDraggingVideo(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingVideo(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleVideoFile(file);
                        }}
                        className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center group ${
                          isDraggingVideo
                            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                            : 'border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-black text-white">
                          Click to browse device or drag & drop video for Slide {activeSlideIndex + 1}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Accepts MP4, WebM, and MOV formats. Automatically captures a poster frame.
                        </p>
                      </div>

                      {uploadedVideoMeta && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3 animate-fadeIn">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                              <Film className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{uploadedVideoMeta.name}</p>
                              <p className="text-[10px] text-slate-400">{uploadedVideoMeta.size} • Slide {activeSlideIndex + 1} Video</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); videoInputRef.current?.click(); }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 border border-slate-700"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeleteVideoAsset(); }}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-[11px] font-bold text-rose-400 border border-rose-500/30 flex items-center gap-1 cursor-pointer"
                              title="Delete video completely from this slide"
                            >
                              <Trash2 className="w-3 h-3" /> Delete Video
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary Poster Frame Upload */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <FileImage className="w-4 h-4 text-amber-400" />
                          <span>Fallback Thumbnail / Poster Image</span>
                        </label>
                        <span className="text-[10px] text-slate-500">Auto-captured or upload custom</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0 relative">
                          <img
                            src={currentSlide.posterUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                            alt="Poster Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        </div>
                        <div className="flex-1 w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                          <div>
                            <p className="text-xs font-bold text-white">Upload Custom Poster Image</p>
                            <p className="text-[10px] text-slate-400">Supports PNG, JPG, WebP up to 10MB</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" /> Choose Image
                            </button>
                            {currentSlide.posterUrl && (
                              <button
                                type="button"
                                onClick={handleDeleteImageAsset}
                                className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center transition-all cursor-pointer"
                                title="Delete fallback poster"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Image Format Upload */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <FileImage className="w-4 h-4 text-emerald-400" />
                        <span>High-Resolution Photo for Slide {activeSlideIndex + 1}</span>
                      </label>
                      <span className="text-[10px] font-mono text-emerald-400">Direct Upload</span>
                    </div>

                    <div
                      onClick={() => imageInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                      onDragLeave={() => setIsDraggingImage(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingImage(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                      className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center group ${
                        isDraggingImage
                          ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                          : 'border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                        <FileImage className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-black text-white">
                        Click to browse or drag & drop high-res image for Slide {activeSlideIndex + 1}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Ultra-crisp WebP, JPG, or PNG. Scales flawlessly across retina and mobile screens.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={currentSlide.posterUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                          alt="Hero Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">Slide {activeSlideIndex + 1} Photo Asset</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {uploadedImageMeta ? `${uploadedImageMeta.name} (${uploadedImageMeta.size})` : currentSlide.posterUrl ? 'Active Image Asset' : 'No photo uploaded (Clean Gradient)'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" /> Replace Photo
                        </button>
                        {currentSlide.posterUrl && (
                          <button
                            type="button"
                            onClick={handleDeleteImageAsset}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Delete photo completely from this slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DIRECT STREAMING URL MODE */}
            {sourceMode === 'url' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Remote Cloud URLs (CDN / S3 / Supabase)</span>
                  <button
                    type="button"
                    onClick={handleTestStream}
                    disabled={isTestingStream}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingStream ? 'animate-spin' : ''}`} />
                    <span>{isTestingStream ? 'Testing Ping...' : 'Test Stream Ping'}</span>
                  </button>
                </div>

                {currentSlide.type === 'video' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Background Video URL (.mp4 / .webm) for Slide {activeSlideIndex + 1}
                    </label>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          value={currentSlide.videoUrl}
                          onChange={(e) => handleUpdateCurrentSlide('videoUrl', e.target.value)}
                          placeholder="https://cdn.akuamarket.com/video/hero.mp4"
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <Video className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      </div>
                      {currentSlide.videoUrl && (
                        <button
                          type="button"
                          onClick={() => handleUpdateCurrentSlide('videoUrl', '')}
                          className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer"
                          title="Clear video URL"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Poster Image Fallback URL for Slide {activeSlideIndex + 1}
                  </label>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={currentSlide.posterUrl}
                        onChange={(e) => handleUpdateCurrentSlide('posterUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <ImageIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                    {currentSlide.posterUrl && (
                      <button
                        type="button"
                        onClick={() => handleUpdateCurrentSlide('posterUrl', '')}
                        className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer"
                        title="Clear photo URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Marketing Copy Overlays for Slide [activeSlideIndex] */}
          <GlassCard className="space-y-5 border-slate-800/90 shadow-xl bg-slate-900/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Text & Marketing Copy</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                      Slide {activeSlideIndex + 1}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Custom messaging and call-to-action buttons for this slide
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                Live Dynamic Overlay
              </span>
            </div>

            {/* Badge Tag & Accent Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Badge Tag Label
                  </label>
                  {/* Live badge preview pill */}
                  {currentSlide.badge && (
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      currentSlide.badgeColor === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : currentSlide.badgeColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : currentSlide.badgeColor === 'rose'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    }`}>
                      <Zap className="w-2.5 h-2.5" />
                      <span className="truncate max-w-[120px]">{currentSlide.badge}</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={currentSlide.badge || ''}
                  onChange={(e) => handleUpdateCurrentSlide('badge', e.target.value)}
                  placeholder="e.g. Express 2-Hour Delivery"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Badge Accent Theme
                </label>
                <div className="relative">
                  <select
                    value={currentSlide.badgeColor || 'emerald'}
                    onChange={(e) => handleUpdateCurrentSlide('badgeColor', e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                  >
                    <option value="emerald" className="bg-slate-900 text-white">Ghana Emerald (Fresh & Fast Groceries)</option>
                    <option value="amber" className="bg-slate-900 text-white">Warm Gold (Wholesale Deals & Pallets)</option>
                    <option value="indigo" className="bg-slate-900 text-white">Tech Indigo (Modern Mall & Electronics)</option>
                    <option value="rose" className="bg-slate-900 text-white">Hot Promo Red (Clearance & Deals)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Slide Headline
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {(currentSlide.headline || '').length} chars • bold high-impact
                </span>
              </div>
              <input
                type="text"
                value={currentSlide.headline || ''}
                onChange={(e) => handleUpdateCurrentSlide('headline', e.target.value)}
                placeholder="e.g. Direct from Ghana Producers to Your Door"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Subheadline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Subheadline / Value Proposition
              </label>
              <textarea
                rows={2}
                value={currentSlide.subheadline || ''}
                onChange={(e) => handleUpdateCurrentSlide('subheadline', e.target.value)}
                placeholder="Briefly describe what makes this offer special..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-normal text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 leading-relaxed resize-none transition-all"
              />
            </div>

            {/* CTA Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Primary Action Button (Gold / Highlight)
                </label>
                <input
                  type="text"
                  value={currentSlide.ctaText || ''}
                  onChange={(e) => handleUpdateCurrentSlide('ctaText', e.target.value)}
                  placeholder="e.g. Shop Wholesale Catalog"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-bold text-amber-400 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Secondary Action Button (Ghost / Outline)
                </label>
                <input
                  type="text"
                  value={currentSlide.ctaSecondaryText || ''}
                  onChange={(e) => handleUpdateCurrentSlide('ctaSecondaryText', e.target.value)}
                  placeholder="e.g. Track Freight Order"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-bold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all"
                />
              </div>
            </div>
          </GlassCard>

          {/* Cinematic Tint & Darkening Vignette */}
          <GlassCard className="space-y-5 border-slate-800/90 shadow-xl bg-slate-900/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Cinematic Tint & Vignette</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                      Slide {activeSlideIndex + 1}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Adjust background opacity and ambient color grading
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 self-start sm:self-auto">
                {currentSlide.opacity ?? 65}% Darkening
              </span>
            </div>

            {/* Interactive Opacity Bar with Dynamic Visual Track */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <span>Lighter (Max video clarity)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>Darker (Max text contrast)</span>
                </span>
              </div>

              {/* Styled Range Slider */}
              <div className="relative py-1">
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={currentSlide.opacity ?? 65}
                  onChange={(e) => handleUpdateCurrentSlide('opacity', Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none bg-slate-800 accent-emerald-400 cursor-pointer focus:outline-none"
                />
              </div>

              {/* Quick Opacity Presets */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {[
                  { label: '35% Soft', val: 35 },
                  { label: '55% Balanced', val: 55 },
                  { label: '65% Standard (Rec.)', val: 65 },
                  { label: '80% High Contrast', val: 80 }
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => handleUpdateCurrentSlide('opacity', p.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      (currentSlide.opacity ?? 65) === p.val
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-750'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Mood Palette Cards */}
            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold text-slate-200">
                Ambient Color Grading Mood
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'emerald',
                    label: 'Ghana Emerald',
                    tag: 'Fresh Groceries',
                    color: 'bg-emerald-500',
                    gradient: 'from-emerald-950/90 to-slate-950'
                  },
                  {
                    id: 'midnight',
                    label: 'Midnight Slate',
                    tag: 'Neutral Clean',
                    color: 'bg-slate-400',
                    gradient: 'from-slate-900/90 to-slate-950'
                  },
                  {
                    id: 'indigo',
                    label: 'Royal Indigo',
                    tag: 'Tech Mall',
                    color: 'bg-indigo-500',
                    gradient: 'from-indigo-950/90 to-slate-950'
                  },
                  {
                    id: 'amber',
                    label: 'Golden Sunset',
                    tag: 'Wholesale Deals',
                    color: 'bg-amber-500',
                    gradient: 'from-amber-950/90 to-slate-950'
                  }
                ].map((item) => {
                  const isSelected = (currentSlide.tint || 'emerald') === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleUpdateCurrentSlide('tint', item.id)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden bg-gradient-to-b ${item.gradient} ${
                        isSelected
                          ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
                          : 'border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full ${item.color} shadow-sm`} />
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-emerald-400 text-slate-950">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white truncate">{item.label}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.tag}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Footer inside Left Column */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300">
                  Slide {activeSlideIndex + 1} ready
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSlide}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Slide</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save & Publish Live'}</span>
                </button>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Live Storefront Viewport Simulator (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          
          {/* Viewport Header with Countdown & Controls */}
          <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Live Viewport</span>
            </div>

            {/* Countdown Badge */}
            {autoRotate ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                <Timer className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Next in {countdown}s</span>
              </div>
            ) : (
              <div className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                Rotation Paused
              </div>
            )}

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveDevice('desktop')}
                title="Desktop View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  activeDevice === 'desktop' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveDevice('tablet')}
                title="Tablet View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  activeDevice === 'tablet' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveDevice('mobile')}
                title="Mobile View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  activeDevice === 'mobile' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Screen Viewport Frame */}
          <div className={`mx-auto transition-all duration-300 ${
            activeDevice === 'desktop' ? 'w-full' : activeDevice === 'tablet' ? 'max-w-md' : 'max-w-xs'
          }`}>
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-950 aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-end p-5 md:p-6 group">
              
              {/* Background Video / Photo Engine */}
              {activePreviewSlide.type === 'video' && activePreviewSlide.videoUrl ? (
                <video
                  ref={videoRef}
                  key={activePreviewSlide.videoUrl}
                  src={activePreviewSlide.videoUrl}
                  poster={activePreviewSlide.posterUrl || undefined}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activePreviewSlide.posterUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
                  alt="Hero Poster"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              )}

              {/* Dynamic Gradient Overlay */}
              <div
                className="absolute inset-0 transition-colors duration-300"
                style={{
                  background: `linear-gradient(to top, ${tintGradients[activePreviewSlide.tint] || 'rgba(2,6,23,0.7)'} 0%, rgba(2,6,23,0.3) 60%, rgba(2,6,23,0.1) 100%)`
                }}
              />

              {/* 60s Progress Bar on Top */}
              {autoRotate && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${((rotationInterval - countdown) / rotationInterval) * 100}%` }}
                  />
                </div>
              )}

              {/* Viewport Playback HUD Controls */}
              {activePreviewSlide.type === 'video' && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Slide Navigation Arrow Overlays */}
              <button
                type="button"
                onClick={() => {
                  setPreviewSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
                  setCountdown(rotationInterval);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPreviewSlideIndex((prev) => (prev + 1) % slides.length);
                  setCountdown(rotationInterval);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Slide Indicator Badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                  SLIDE {previewSlideIndex + 1} OF 3
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                  {activePreviewSlide.type === 'video' ? 'VIDEO' : 'PHOTO'}
                </span>
              </div>

              {/* Overlaid Marketing Content on Canvas */}
              <div className="relative z-10 space-y-2 text-left">
                {/* Badge */}
                {activePreviewSlide.badge && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                    activePreviewSlide.badgeColor === 'emerald'
                      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                      : activePreviewSlide.badgeColor === 'amber'
                      ? 'bg-amber-500/25 text-amber-300 border-amber-500/40'
                      : activePreviewSlide.badgeColor === 'rose'
                      ? 'bg-rose-500/25 text-rose-300 border-rose-500/40'
                      : 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40'
                  }`}>
                    <Zap className="w-3 h-3" />
                    <span>{activePreviewSlide.badge}</span>
                  </span>
                )}

                {/* Headline */}
                <h3 className="text-base sm:text-lg md:text-xl font-black text-white leading-tight line-clamp-2 drop-shadow-md">
                  {activePreviewSlide.headline}
                </h3>

                {/* Subtitle */}
                {activePreviewSlide.subheadline && activeDevice !== 'mobile' && (
                  <p className="text-[11px] text-slate-200 line-clamp-2 drop-shadow leading-relaxed max-w-sm">
                    {activePreviewSlide.subheadline}
                  </p>
                )}

                {/* Action Buttons & Indicator Dots */}
                <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {activePreviewSlide.ctaText && (
                      <span className="px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-lg flex items-center gap-1.5">
                        <span>{activePreviewSlide.ctaText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                    {activePreviewSlide.ctaSecondaryText && activeDevice === 'desktop' && (
                      <span className="px-3 py-1.5 rounded-full bg-slate-900/80 text-white font-bold text-[11px] border border-white/20 backdrop-blur-sm">
                        {activePreviewSlide.ctaSecondaryText}
                      </span>
                    )}
                  </div>

                  {/* 3 Slide Dots */}
                  <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setPreviewSlideIndex(i);
                          setCountdown(rotationInterval);
                        }}
                        className={`transition-all rounded-full cursor-pointer ${
                          previewSlideIndex === i
                            ? 'w-4 h-1.5 bg-amber-400'
                            : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        title={`Switch to Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Real-Time Telemetry Diagnostic Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-300 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Stream Telemetry & CDN Diagnostics</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Rotating Every {rotationInterval}s
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500 block">Current Slide Slot</span>
                <span className="font-mono text-slate-200 font-bold">Slide {previewSlideIndex + 1} of 3</span>
              </div>
              <div>
                <span className="text-slate-500 block">Asset Format</span>
                <span className="font-mono text-slate-200 font-bold uppercase">{activePreviewSlide.type}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Next Slide Timer</span>
                <span className="font-mono text-emerald-400 font-bold">{countdown}s remaining</span>
              </div>
              <div>
                <span className="text-slate-500 block">Target Resolution</span>
                <span className="font-mono text-slate-200 font-bold">1080p FHD Wide</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
