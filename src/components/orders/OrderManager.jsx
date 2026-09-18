import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { OrderStatusTabs } from './OrderStatusTabs';
import { OrderDetailDrawer } from './OrderDetailDrawer';
import { DispatchModal } from './DispatchModal';
import { fetchOrdersApi, updateOrderStatusApi, dispatchOrderApi, deleteOrderApi } from '../../services/api';
import { toast } from 'sonner';
import { Search, Eye, Truck, CheckCircle2, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

const initialOrdersData = [
  {
    id: 'GH-WH-9482',
    order_number: 'GH-WH-9482',
    customer_name: 'Kwame & Sons Supermarket',
    customer_phone: '+233 24 411 2233',
    customer_email: 'kwame@supermarket.gh',
    shipping_address: 'Spintex Road, Accra',
    delivery_zone_name: 'Tema & Spintex Corridor',
    status: 'pending',
    total_amount: 4620.00,
    payment_status: 'paid',
    payment_method: 'Paystack MoMo',
    payment_gateway_ref: 'PST-9482-ACC',
    created_at: '2026-09-16 14:20',
    items: [{ title: 'Royal Aroma Long Grain Rice 5kg', quantity: 5, unit_price: 920.00 }]
  },
  {
    id: 'GH-WH-8831',
    order_number: 'GH-WH-8831',
    customer_name: 'East Legon Mart',
    customer_phone: '+233 20 099 8877',
    customer_email: 'orders@eastlegonmart.com',
    shipping_address: 'Boundary Road, East Legon',
    delivery_zone_name: 'East Legon & Madina Hub',
    status: 'processing',
    total_amount: 2150.00,
    payment_status: 'paid',
    payment_method: 'Paystack MoMo',
    payment_gateway_ref: 'PST-8831-LEG',
    created_at: '2026-09-16 12:45',
    items: [{ title: 'SunGold Vegetable Cooking Oil 5L', quantity: 2, unit_price: 1075.00 }]
  },
  {
    id: 'GH-WH-7210',
    order_number: 'GH-WH-7210',
    customer_name: 'Asante Wholesale Ltd',
    customer_phone: '+233 27 733 4455',
    customer_email: 'asante@wholesalekom.com',
    shipping_address: 'Adum Market Square, Kumasi',
    delivery_zone_name: 'Kumasi & Regional Cities',
    status: 'out_for_delivery',
    total_amount: 10600.00,
    payment_status: 'paid',
    payment_method: 'Stripe Credit Card',
    payment_gateway_ref: 'STR-7210-KMS',
    created_at: '2026-09-15 17:30',
    items: [{ title: 'Hisense 55" Smart 4K TV Crate', quantity: 1, unit_price: 10600.00 }]
  },
  {
    id: 'GH-WH-6102',
    order_number: 'GH-WH-6102',
    customer_name: 'Airport Residential Pharmacy',
    customer_phone: '+233 50 112 3344',
    customer_email: 'info@airportpharm.gh',
    shipping_address: 'Airport Residential Area, Accra',
    delivery_zone_name: 'Central Accra Metro',
    status: 'delivered',
    total_amount: 1550.00,
    payment_status: 'paid',
    payment_method: 'Paystack MoMo',
    payment_gateway_ref: 'PST-6102-AIR',
    created_at: '2026-09-14 09:15',
    items: [{ title: 'Bic Blue Ballpoint Pens Carton', quantity: 1, unit_price: 1550.00 }]
  }
];

export function OrderManager() {
  const [orders, setOrders] = useState(initialOrdersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dispatchOrder, setDispatchOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      const remoteOrders = await fetchOrdersApi();
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
    }
    loadOrders();
  }, []);

  const handleUpdateStatus = async (order, newStatus) => {
    await updateOrderStatusApi(order.id, newStatus);
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    toast.success(`Order #${order.order_number || order.id} status updated to ${newStatus.replace('_', ' ')}`);
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleAssignRiderClick = (order) => {
    setDispatchOrder(order);
  };

  const handleConfirmDispatch = async (orderId, riderName, riderPhone) => {
    await dispatchOrderApi(orderId, {
      courierName: riderName,
      courierPhone: riderPhone,
      vehicleType: 'Motorbike Express',
      status: 'out_for_delivery'
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'out_for_delivery', courier_name: riderName } : o));
    toast.success(`Logistics dispatch active for Order #${orderId}`);
  };

  const counts = orders.reduce((acc, o) => {
    acc.All = (acc.All || 0) + 1;
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const filteredOrders = orders.filter(o => {
    const matchesFilter = activeFilter === 'All' || o.status === activeFilter;
    const matchesSearch = !searchQuery ||
      (o.order_number || o.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_name || o.buyer_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Order Management & Logistics Pipeline</h2>
          <p className="text-xs text-slate-400 mt-1">Track orders, assign rider dispatches, and trigger multi-channel alerts.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <OrderStatusTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {/* Orders Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Delivery Zone</th>
                <th className="py-3.5 px-4 font-bold">Total</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white font-mono">
                      #{order.order_number || order.id}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">{order.created_at}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-white">{order.customer_name || order.buyer_name}</p>
                      <p className="text-[11px] text-slate-400">{order.customer_phone || order.momo_number}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {order.delivery_zone_name || order.shipping_address || order.location}
                    </td>
                    <td className="py-4 px-4 font-black text-emerald-400">
                      GH₵ {Number(order.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        order.status === 'out_for_delivery' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        order.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {order.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAssignRiderClick(order)}
                          className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all"
                          title="Assign Courier Rider"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={selectedOrder}
        onAssignRider={handleAssignRiderClick}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Dispatch Modal */}
      <DispatchModal
        isOpen={Boolean(dispatchOrder)}
        onClose={() => setDispatchOrder(null)}
        order={dispatchOrder}
        onConfirmDispatch={handleConfirmDispatch}
      />
    </div>
  );
}
