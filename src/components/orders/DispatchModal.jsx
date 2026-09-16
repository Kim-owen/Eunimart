import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { triggerNotificationApi } from '../../services/api';
import { toast } from 'sonner';
import { Truck, Send, MessageSquare, Mail, UserCheck } from 'lucide-react';

export function DispatchModal({ isOpen, onClose, order, onConfirmDispatch }) {
  const [courierName, setCourierName] = useState('Kofi Mensah (Speedy Express)');
  const [courierPhone, setCourierPhone] = useState('+233 55 987 6543');
  const [notifyCustomerSms, setNotifyCustomerSms] = useState(true);
  const [notifyCustomerEmail, setNotifyCustomerEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Dispatch multi-channel notification simulation
    if (notifyCustomerSms) {
      await triggerNotificationApi({
        channel: 'sms',
        recipient: order.customer_phone || order.momo_number || '+233501234567',
        message: `Hi ${order.customer_name || 'Customer'}! Your AkuaMarket order #${order.order_number || order.id} has been dispatched with courier ${courierName} (${courierPhone}). ETA: 2-4 Hours.`
      });
    }

    if (notifyCustomerEmail) {
      await triggerNotificationApi({
        channel: 'email',
        recipient: order.customer_email || 'customer@akuamarket.com',
        subject: `Dispatch Confirmation - AkuaMarket Order #${order.order_number || order.id}`,
        message: `Your package is out for delivery with ${courierName}. Contact: ${courierPhone}`
      });
    }

    toast.success(`Order #${order.order_number || order.id} assigned to ${courierName}. Notifications sent!`);
    onConfirmDispatch(order.id, courierName, courierPhone);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Dispatch Logistics: #${order.order_number || order.id}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-100">
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs">
          <p className="font-bold text-white">Customer Details:</p>
          <p className="text-slate-400 mt-0.5">{order.customer_name || order.buyer_name} ({order.customer_phone || order.momo_number || '+233 24 123 4567'})</p>
          <p className="text-emerald-400 font-semibold mt-1">{order.shipping_address || order.location}</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Assign Courier / Rider</label>
          <select
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Kofi Mensah (Speedy Express)">Kofi Mensah (Speedy Express Accra)</option>
            <option value="Yaw Frimpong (Tema Logistics)">Yaw Frimpong (Tema Logistics)</option>
            <option value="Kwaku Baah (East Legon Freight)">Kwaku Baah (East Legon Freight)</option>
            <option value="Direct Express Rider #04">Direct Express Rider #04</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Rider Phone Contact</label>
          <input
            type="text"
            value={courierPhone}
            onChange={(e) => setCourierPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Multi-Channel Alerts Controls */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-slate-300">Automated Multi-Channel Notifications</label>
          
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyCustomerSms}
              onChange={(e) => setNotifyCustomerSms(e.target.checked)}
              className="rounded accent-emerald-500 w-4 h-4"
            />
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Send Instant Customer SMS (TxtConnect / Twilio)
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyCustomerEmail}
              onChange={(e) => setNotifyCustomerEmail(e.target.checked)}
              className="rounded accent-emerald-500 w-4 h-4"
            />
            <Mail className="w-3.5 h-3.5 text-amber-400" /> Send Transactional Email Receipt (Resend API)
          </label>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {loading ? 'Triggering Alerts...' : 'Confirm Dispatch'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
