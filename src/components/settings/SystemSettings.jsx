import React, { useState } from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import { Settings, Bell, Clock, AlertOctagon, Save, Phone, Mail, MessageSquare } from 'lucide-react';

export function SystemSettings() {
  const { policies, updatePolicies, notifications, updateNotifications } = useStoreSettings();

  const [minOrder, setMinOrder] = useState(policies.minOrderAmount || 50);
  const [hours, setHours] = useState(policies.businessHours || '8:00 AM - 10:00 PM GMT');
  const [maintMode, setMaintMode] = useState(policies.maintenanceMode || false);
  const [maintMsg, setMaintMsg] = useState(policies.maintenanceMessage || 'Routine maintenance.');

  const [adminPhone, setAdminPhone] = useState(notifications.adminPhone || '+233501234567');
  const [adminEmail, setAdminEmail] = useState(notifications.adminEmail || 'alerts@akuamarket.com');
  const [custSms, setCustSms] = useState(notifications.customerSmsEnabled || true);
  const [custEmail, setCustEmail] = useState(notifications.customerEmailEnabled || true);

  const handleSavePolicies = (e) => {
    e.preventDefault();
    updatePolicies({
      minOrderAmount: Number(minOrder),
      businessHours: hours,
      maintenanceMode: maintMode,
      maintenanceMessage: maintMsg
    });
    toast.success("Store Business Policies saved successfully!");
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    updateNotifications({
      adminPhone,
      adminEmail,
      customerSmsEnabled: custSms,
      customerEmailEnabled: custEmail
    });
    toast.success("Multi-Channel Alert configurations saved!");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">System Settings & Notifications</h2>
          <p className="text-xs text-slate-400 mt-1">Store business policies, maintenance modes, and transactional alert channels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Policies */}
        <GlassCard className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" /> Store Business Policies
            </h3>
          </div>

          <form onSubmit={handleSavePolicies} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Minimum Order Checkout Amount (GH₵)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Store Business Operating Hours</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-amber-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintMode}
                  onChange={(e) => setMaintMode(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                <AlertOctagon className="w-4 h-4" /> Temporary Storefront Maintenance Mode
              </label>

              {maintMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Custom Announcement Banner</label>
                  <input
                    type="text"
                    value={maintMsg}
                    onChange={(e) => setMaintMsg(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
            >
              <Save className="w-4 h-4" /> Save Store Policies
            </button>
          </form>
        </GlassCard>

        {/* Multi-Channel Alerts */}
        <GlassCard className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" /> Multi-Channel Alerts Setup
            </h3>
          </div>

          <form onSubmit={handleSaveNotifications} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Admin Alert Phone Number (SMS Trigger)</label>
              <input
                type="text"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Admin Alert Email (Resend API)</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs">
              <label className="block font-bold text-slate-300">Automated Notification Toggles</label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={custSms}
                  onChange={(e) => setCustSms(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
                <MessageSquare className="w-4 h-4 text-emerald-400" /> TxtConnect / Twilio Customer SMS Alerts
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={custEmail}
                  onChange={(e) => setCustEmail(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
                <Mail className="w-4 h-4 text-amber-400" /> Resend / SendGrid Customer Email Receipts
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
            >
              <Save className="w-4 h-4" /> Save Alert Configurations
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
