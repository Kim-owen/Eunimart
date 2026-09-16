import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Package, User, MapPin, Phone, Mail, CreditCard, ShieldCheck, Truck, CheckCircle2, Clock } from 'lucide-react';

export function OrderDetailDrawer({ isOpen, onClose, order, onAssignRider, onUpdateStatus }) {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items_json || '[]');

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Order #${order.order_number || order.id}`}>
      <div className="space-y-6 text-sm text-slate-200">
        {/* Status Header Badge */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Order Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                order.status === 'out_for_delivery' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                order.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}>
                {order.status?.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Total Amount</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">
              GH₵ {Number(order.total_amount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" /> Customer & Shipping Info
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Customer Name:</span>
              <span className="font-bold text-white">{order.customer_name || order.buyer_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Phone Contact:</span>
              <span className="font-bold text-emerald-400">{order.customer_phone || order.momo_number || '+233 24 123 4567'}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-slate-400 shrink-0">Shipping Address:</span>
              <span className="font-bold text-white text-right">{order.shipping_address || order.location || 'Accra, Ghana'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Delivery Zone:</span>
              <span className="font-bold text-amber-400">{order.delivery_zone_name || 'Central Accra Metro (GH₵25.00)'}</span>
            </div>
          </div>
        </div>

        {/* Payment & Gateway Reference */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Payment & Transaction Ref
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-bold text-white">{order.payment_method || 'Paystack Mobile Money'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Payment Status:</span>
              <span className="font-bold text-emerald-400 uppercase">{order.payment_status || 'Paid'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Gateway Ref:</span>
              <span className="font-mono text-slate-300 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {order.payment_gateway_ref || `PST-PAY-${Math.floor(100000 + Math.random()*900000)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" /> Purchased Items ({items.length})
          </h4>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-white">{item.title || item.name}</p>
                  <p className="text-[11px] text-slate-400">Qty: {item.quantity || item.qty || 1} x GH₵ {item.unit_price || item.price || 100}</p>
                </div>
                <span className="text-xs font-black text-emerald-400">
                  GH₵ {((item.quantity || item.qty || 1) * (item.unit_price || item.price || 100)).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => onAssignRider(order)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Truck className="w-4 h-4" /> Assign Rider & Dispatch Alert
          </button>
          <button
            onClick={() => onUpdateStatus(order, 'delivered')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mark as Delivered
          </button>
        </div>
      </div>
    </Drawer>
  );
}
