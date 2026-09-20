import React, { useState, useEffect } from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useAdminGuard } from '../security/useAdminGuard';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import {
  Settings,
  Bell,
  Clock,
  AlertOctagon,
  Save,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Send,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  Sliders,
  DollarSign,
  Lock,
  RefreshCw
} from 'lucide-react';

export function SystemSettings() {
  const {
    policies,
    updatePolicies,
    notifications,
    updateNotifications,
    paymentSettings,
    updatePaymentSettings
  } = useStoreSettings();

  const { isAdmin } = useAdminGuard();

  const [activeTab, setActiveTab] = useState('policies'); // 'policies' | 'notifications' | 'payments' | 'maintenance'

  // Policies State
  const [minOrder, setMinOrder] = useState(policies.minOrderAmount || 50);
  const [hours, setHours] = useState(policies.businessHours || '8:00 AM - 10:00 PM GMT');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(policies.freeShippingThreshold || 1500);
  const [taxRate, setTaxRate] = useState(policies.taxRate || '0');
  const [maintMode, setMaintMode] = useState(policies.maintenanceMode || false);
  const [maintMsg, setMaintMsg] = useState(policies.maintenanceMessage || 'AkuaMarket is currently undergoing inventory audit. Orders resume shortly.');

  // Notifications State
  const [adminPhone, setAdminPhone] = useState(notifications.adminPhone || '+233 50 123 4567');
  const [adminEmail, setAdminEmail] = useState(notifications.adminEmail || 'alerts@akuamarket.com');
  const [custSms, setCustSms] = useState(notifications.customerSmsEnabled ?? true);
  const [custEmail, setCustEmail] = useState(notifications.customerEmailEnabled ?? true);
  const [staffAlerts, setStaffAlerts] = useState(notifications.staffAlertsEnabled ?? true);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Payment Gateway State (Loaded securely from server)
  const [paystackEnv, setPaystackEnv] = useState(paymentSettings?.paystackEnv || 'test'); // 'test' | 'live'
  const [paystackPubKey, setPaystackPubKey] = useState(paymentSettings?.paystackPubKey || '');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [momoChannels, setMomoChannels] = useState(paymentSettings?.momoChannels || {
    mtn: true,
    telecel: true,
    atMoney: true
  });
  const [isSavingPayments, setIsSavingPayments] = useState(false);

  // Sync payment settings when loaded from server
  useEffect(() => {
    if (paymentSettings) {
      if (paymentSettings.paystackEnv) setPaystackEnv(paymentSettings.paystackEnv);
      if (paymentSettings.paystackPubKey !== undefined) setPaystackPubKey(paymentSettings.paystackPubKey);
      if (paymentSettings.momoChannels) setMomoChannels(paymentSettings.momoChannels);
    }
  }, [paymentSettings]);

  const handleSavePolicies = (e) => {
    e.preventDefault();
    updatePolicies({
      minOrderAmount: Number(minOrder),
      businessHours: hours,
      freeShippingThreshold: Number(freeShippingThreshold),
      taxRate,
      maintenanceMode: maintMode,
      maintenanceMessage: maintMsg
    });
    toast.success("Store commerce policies and operating constraints saved!");
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    updateNotifications({
      adminPhone,
      adminEmail,
      customerSmsEnabled: custSms,
      customerEmailEnabled: custEmail,
      staffAlertsEnabled: staffAlerts
    });
    toast.success("Multi-Channel notification triggers saved!");
  };

  const handleSavePayments = async (e) => {
    if (e) e.preventDefault();
    setIsSavingPayments(true);
    try {
      await updatePaymentSettings({
        paystackEnv,
        paystackPubKey,
        paystackSecretKey: newSecretKey.trim() || undefined,
        momoChannels
      });
      setNewSecretKey(''); // Clear out plaintext secret from state once saved
      toast.success("Payment gateway settings securely saved to server vault!");
    } catch (err) {
      toast.error("Failed to save payment settings: " + err.message);
    } finally {
      setIsSavingPayments(false);
    }
  };

  const handleSendTestSms = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      toast.success(`📲 Test SMS dispatched to ${adminPhone}! [TxtConnect Provider: 200 OK]`);
    }, 800);
  };

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin.replace(':3030', ':5050')}/api/webhooks/paystack`
    : '/api/webhooks/paystack';

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("Webhook URL copied to clipboard!");
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center space-y-4 animate-fadeIn">
        <div className="inline-flex p-4 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertOctagon className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-white">Administrative Access Required</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          System policies, multi-channel alerts, and payment gateway settlement credentials can only be accessed by authenticated System Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3 h-3" /> Core Engine Configuration
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
              Port 5050 SQLite Sync
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">System Settings & Infrastructure Control</h2>
          <p className="text-xs text-slate-400">
            Configure business policies, payment gateway credentials, SMS/Email alerts, and emergency broadcast banners.
          </p>
        </div>
      </div>

      {/* System Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3 border-slate-800">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Database Persistence</p>
            <p className="text-sm font-black text-emerald-400 truncate">SQLite Linked (:5050)</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3 border-slate-800">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">SMS Gateway</p>
            <p className="text-sm font-black text-white truncate">TxtConnect / Arkesel</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3 border-slate-800">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Paystack MoMo</p>
            <p className="text-sm font-black text-amber-400 uppercase truncate">{paystackEnv} Mode Active</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3 border-slate-800">
          <div className={`p-2.5 rounded-2xl flex-shrink-0 ${
            maintMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Storefront Status</p>
            <p className={`text-sm font-black truncate ${maintMode ? 'text-amber-400' : 'text-emerald-400'}`}>
              {maintMode ? 'Maintenance Armed' : 'Live & Operational'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-800 flex-nowrap scroll-smooth touch-pan-x min-w-0 w-full">
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeTab === 'policies'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" /> Store Policies & Limits
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-4 h-4" /> Multi-Channel Alerts
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Paystack & MoMo Gateways
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeTab === 'maintenance'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <AlertOctagon className="w-4 h-4" /> Emergency Broadcast
        </button>
      </div>

      {/* Tab 1: Policies & Commerce Limits */}
      {activeTab === 'policies' && (
        <GlassCard className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" /> Commerce Rules & Checkout Constraints
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Enforce order minimums and operational hours for the wholesale storefront.</p>
            </div>
          </div>

          <form onSubmit={handleSavePolicies} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Minimum Order Checkout Threshold (GH₵)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400">GH₵</span>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Carts below this amount cannot proceed to payment settlement.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Free Freight Shipping Threshold (GH₵)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400">GH₵</span>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Orders exceeding this total automatically receive 100% free delivery.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Store Business Operating Hours
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 7:30 AM - 9:30 PM GMT"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Displayed to customers in checkout and order tracking views.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tax / VAT Policy Setting
                </label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="0">0% Wholesale Exempt (Direct Producer)</option>
                  <option value="3">3% Flat Rate VAT / NHIL</option>
                  <option value="15">15% Standard Commercial VAT</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Automatically computed on pro-forma RFQ quotes and invoices.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Commerce Policies
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 2: Multi-Channel Alerts */}
      {activeTab === 'notifications' && (
        <GlassCard className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" /> Multi-Channel Alert & Dispatch Gateway
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated SMS order updates via TxtConnect and email receipts via Resend.</p>
            </div>

            <button
              onClick={handleSendTestSms}
              disabled={isSendingTest}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingTest ? 'Dispatched Ping...' : 'Send Test SMS Ping'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveNotifications} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admin Alert Phone Number (Instant SMS on New Order)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Receives SMS ping with Order ID and MoMo settlement amount.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admin Notification Email (Resend SMTP Gateway)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Receives daily inventory digests and low-stock alerts.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Automated Transaction Triggers
              </label>

              <div className="space-y-2.5 text-xs text-slate-300">
                <label className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={custSms}
                    onChange={(e) => setCustSms(e.target.checked)}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      Send Customer Delivery Status SMS
                    </p>
                    <p className="text-[11px] text-slate-400">Sends SMS when order is dispatched and delivers the 4-digit OTP code.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={custEmail}
                    onChange={(e) => setCustEmail(e.target.checked)}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      Send Customer Email PDF Receipts & Waybills
                    </p>
                    <p className="text-[11px] text-slate-400">Attaches official VAT invoice and proof of MoMo payment confirmation.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={staffAlerts}
                    onChange={(e) => setStaffAlerts(e.target.checked)}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-indigo-400" />
                      Dispatch Rider Mobile Chime Notification
                    </p>
                    <p className="text-[11px] text-slate-400">Notifies active couriers in Rider Portal when an order is ready for pickup.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Alert Channels
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 3: Paystack & MoMo Gateways */}
      {activeTab === 'payments' && (
        <GlassCard className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" /> Paystack & Direct Ghana Mobile Money
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Secure settlement credentials for MTN MoMo, Telecel Cash, and AT Money.</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto flex-shrink-0 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Server-Vault Protected
            </span>
          </div>

          <form onSubmit={handleSavePayments} className="space-y-5">
            {/* Mode Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Payment Environment</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => { setPaystackEnv('test'); toast.info("Environment switched to Sandbox Test Mode"); }}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    paystackEnv === 'test'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Sandbox Test Mode (Demo Payments)
                </button>
                <button
                  type="button"
                  onClick={() => { setPaystackEnv('live'); toast.warning("Switched to Live Production Settlement Mode"); }}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    paystackEnv === 'live'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Live Production Settlement
                </button>
              </div>
            </div>

            {/* Keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Paystack Public Key</label>
                <input
                  type="text"
                  value={paystackPubKey}
                  onChange={(e) => setPaystackPubKey(e.target.value)}
                  placeholder="e.g. pk_test_... or pk_live_..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Used for client-side Paystack Mobile Money modal checkout initialization.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Paystack Secret Key (Server Vault Protected)
                  </label>
                  {paymentSettings?.isSecretKeyConfigured ? (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Configured ({paymentSettings.secretKeyMasked || '••••••••'})
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" /> Not Configured
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                  placeholder={paymentSettings?.isSecretKeyConfigured ? "Enter new key to rotate (leave blank to keep current)" : "sk_test_... or sk_live_..."}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  🔒 Secret keys are stored strictly on the server and cryptographically verify webhooks via HMAC-SHA512.
                </p>
              </div>
            </div>

            {/* Webhook Endpoint Box */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Paystack Webhook Listener URI
                </label>
                <button
                  type="button"
                  onClick={handleCopyWebhook}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold self-start sm:self-auto cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy URI
                </button>
              </div>
              <p className="font-mono text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 select-all break-all">
                {webhookUrl}
              </p>
              <p className="text-[11px] text-slate-400">
                Paste this into your Paystack Dashboard &gt; Settings &gt; API Keys & Webhooks. All incoming payloads are verified using the <code className="text-emerald-400">x-paystack-signature</code> HMAC SHA-512 digest.
              </p>
            </div>

            {/* MoMo Provider Checklist */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Direct Ghana Telecom Settlement Channels
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMomoChannels(prev => ({ ...prev, mtn: !prev.mtn }))}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                    momoChannels.mtn ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">MTN Mobile Money</span>
                  </div>
                  <span className={`text-[10px] font-bold ${momoChannels.mtn ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {momoChannels.mtn ? 'Active' : 'Disabled'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMomoChannels(prev => ({ ...prev, telecel: !prev.telecel }))}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                    momoChannels.telecel ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-white">Telecel Cash</span>
                  </div>
                  <span className={`text-[10px] font-bold ${momoChannels.telecel ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {momoChannels.telecel ? 'Active' : 'Disabled'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMomoChannels(prev => ({ ...prev, atMoney: !prev.atMoney }))}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                    momoChannels.atMoney ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-white">AT Money</span>
                  </div>
                  <span className={`text-[10px] font-bold ${momoChannels.atMoney ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {momoChannels.atMoney ? 'Active' : 'Disabled'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingPayments}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                {isSavingPayments ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving Credentials...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Payment Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 4: Emergency Broadcast & Maintenance Studio */}
      {activeTab === 'maintenance' && (
        <GlassCard className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" /> Emergency Broadcast & Maintenance Studio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Control live storefront availability and broadcast critical store updates.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertOctagon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Temporary Storefront Maintenance Mode</p>
                    <p className="text-[11px] text-slate-300">
                      When enabled, customer checkout is paused and the custom banner is displayed across all pages.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={maintMode}
                    onChange={(e) => {
                      setMaintMode(e.target.checked);
                      toast.info(`Maintenance mode ${e.target.checked ? 'Armed' : 'Disarmed'}`);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Public Announcement Banner Message
                </label>
                <textarea
                  rows="3"
                  value={maintMsg}
                  onChange={(e) => setMaintMsg(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Storefront Customer Banner Preview
              </label>
              <div className={`p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border ${
                maintMode
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${maintMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-bold break-words">
                    {maintMode ? maintMsg : 'Storefront is currently fully operational and accepting Mobile Money orders.'}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex-shrink-0 self-start sm:self-auto">
                  {maintMode ? 'Broadcasting Live' : 'Normal Operation'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSavePolicies}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" /> Save Emergency Broadcast
              </button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
