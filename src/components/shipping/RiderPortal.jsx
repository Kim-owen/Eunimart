import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Smartphone,
  Bike,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { fetchOrdersApi, updateOrderStatusApi } from '../../services/api';
import { toast } from 'sonner';

export function RiderPortal({ onSwitchToAdmin }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('active'); // 'active' | 'completed' | 'all'
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedOrderForOtp, setSelectedOrderForOtp] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Initial rider sample data fallback
  const initialRiderOrders = [
    {
      id: 'GH-WH-8831',
      order_number: 'GH-WH-8831',
      customer_name: 'East Legon Mart',
      customer_phone: '+233 20 099 8877',
      shipping_address: 'Boundary Road, East Legon, Accra',
      delivery_zone_name: 'East Legon & Madina Hub',
      status: 'out_for_delivery',
      total_amount: 2150.00,
      payment_method: 'Paystack MoMo (Settled)',
      items: [{ title: 'SunGold Vegetable Cooking Oil 5L', quantity: 2 }],
      courier_name: 'Kofi Mensah (Dispatch Rider #02)',
      created_at: '35 mins ago'
    },
    {
      id: 'GH-WH-9482',
      order_number: 'GH-WH-9482',
      customer_name: 'Kwame & Sons Supermarket',
      customer_phone: '+233 24 411 2233',
      shipping_address: 'Spintex Road, Near Shell Station, Accra',
      delivery_zone_name: 'Tema & Spintex Corridor',
      status: 'processing',
      total_amount: 4620.00,
      payment_method: 'Paystack MoMo (Settled)',
      items: [{ title: 'Royal Aroma Long Grain Rice 5kg', quantity: 5 }],
      courier_name: 'Kofi Mensah (Dispatch Rider #02)',
      created_at: '1 hour ago'
    },
    {
      id: 'GH-WH-6102',
      order_number: 'GH-WH-6102',
      customer_name: 'Airport Residential Pharmacy',
      customer_phone: '+233 50 112 3344',
      shipping_address: 'Airport Residential Area, Accra',
      delivery_zone_name: 'Central Accra Metro',
      status: 'delivered',
      total_amount: 1550.00,
      payment_method: 'Paystack MoMo (Settled)',
      items: [{ title: 'Bic Blue Ballpoint Pens Carton', quantity: 1 }],
      courier_name: 'Kofi Mensah (Dispatch Rider #02)',
      created_at: 'Today, 10:15 AM'
    }
  ];

  const loadOrders = async () => {
    const data = await fetchOrdersApi();
    if (data && data.length > 0) {
      setOrders(data);
    } else {
      setOrders(initialRiderOrders);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStartDelivery = async (order) => {
    await updateOrderStatusApi(order.id, 'out_for_delivery');
    setOrders(prev =>
      prev.map(o => (o.id === order.id ? { ...o, status: 'out_for_delivery' } : o))
    );
    toast.success(`Route Started. Order #${order.order_number || order.id} is now Out for Delivery.`);
  };

  const handleOpenOtpVerification = (order) => {
    setSelectedOrderForOtp(order);
    setOtpCode('');
    setIsOtpModalOpen(true);
  };

  const handleConfirmOtpDelivery = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      toast.error('Please enter 4-digit customer delivery OTP');
      return;
    }

    if (selectedOrderForOtp) {
      await updateOrderStatusApi(selectedOrderForOtp.id, 'delivered');
      setOrders(prev =>
        prev.map(o => (o.id === selectedOrderForOtp.id ? { ...o, status: 'delivered' } : o))
      );
      toast.success(`Delivery Confirmed. Order #${selectedOrderForOtp.order_number || selectedOrderForOtp.id} delivered.`);
      setIsOtpModalOpen(false);
      setSelectedOrderForOtp(null);
    }
  };

  const normalizeStatus = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '_');
    if (s === 'factory_processing') return 'processing';
    if (s === 'in_transit') return 'out_for_delivery';
    return s;
  };

  const activeOrders = orders.filter(o => {
    const s = normalizeStatus(o.status);
    return s === 'out_for_delivery' || s === 'processing' || s === 'pending';
  });
  const completedOrders = orders.filter(o => normalizeStatus(o.status) === 'delivered');

  const displayedOrders = filter === 'active' ? activeOrders : filter === 'completed' ? completedOrders : orders;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Top Courier Profile & Vehicle Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-6 md:p-8 border border-slate-800/80 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Courier"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Kofi Mensah</h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  Rider #02
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Bike className="w-3.5 h-3.5 text-emerald-400" />
                <span>Express Motorbike (GT-4921-24)</span>
                <span>• Central Accra & East Legon Zone</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Shift Online / Offline Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                isOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span>{isOnline ? 'On Shift (Online)' : 'Off Shift (Paused)'}</span>
            </button>

            {/* Switch back to Full Admin */}
            <button
              onClick={onSwitchToAdmin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch to Admin View</span>
            </button>
          </div>
        </div>

        {/* Courier Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Trips</span>
            <p className="text-xl font-black text-amber-400">{activeOrders.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completed Today</span>
            <p className="text-xl font-black text-emerald-400">{completedOrders.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">MoMo Verified</span>
            <p className="text-xl font-black text-white">GH₵ 3,700</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">On-Time SLA</span>
            <p className="text-xl font-black text-indigo-400">100%</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'active'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Active Route ({activeOrders.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'completed'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Completed Delivered ({completedOrders.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Assigned ({orders.length})
          </button>
        </div>

        <button
          onClick={loadOrders}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          title="Refresh Queue"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Assigned Route Cards */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Assigned Orders in this tab</h3>
            <p className="text-xs text-slate-400">All current deliveries completed or no dispatches in queue.</p>
          </div>
        ) : (
          displayedOrders.map(order => (
            <div
              key={order.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-amber-400">
                    #{order.order_number || order.id}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    order.status === 'out_for_delivery' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' :
                    'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {order.status?.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-xs font-black text-white font-mono">
                  GH₵ {Number(order.total_amount || 0).toLocaleString()} • {order.payment_method || 'Paystack MoMo'}
                </span>
              </div>

              {/* Destination & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Customer & Destination:
                  </span>
                  <p className="font-bold text-white text-sm">{order.customer_name || order.buyer_name}</p>
                  <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{order.shipping_address || order.location}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">{order.delivery_zone_name || 'Accra Metro Corridor'}</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Package Contents:
                  </span>
                  <div className="space-y-1">
                    {order.items?.map((it, idx) => (
                      <p key={idx} className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>{it.quantity}x {it.title}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rider Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {/* Phone Call Link */}
                  <a
                    href={`tel:${order.customer_phone || '+233241234567'}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Customer</span>
                  </a>

                  {/* Navigation Link */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shipping_address || 'Accra Ghana')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Navigate</span>
                  </a>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center gap-2">
                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleStartDelivery(order)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Start Route (In Transit)</span>
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleOpenOtpVerification(order)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Delivery & OTP</span>
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Delivered & Settled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Delivery OTP Verification Modal */}
      {isOtpModalOpen && selectedOrderForOtp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-white shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-black flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Proof of Delivery Verification
              </h3>
              <p className="text-xs text-slate-400">
                Ask customer <b>{selectedOrderForOtp.customer_name}</b> for the 4-digit completion code sent via SMS.
              </p>
            </div>

            <form onSubmit={handleConfirmOtpDelivery} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Customer 4-Digit Delivery Code:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 8831"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-center text-xl font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400 flex items-center justify-between">
                <span>Total Settled via MoMo:</span>
                <span className="font-bold text-white">GH₵ {Number(selectedOrderForOtp.total_amount).toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                >
                  Confirm & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
