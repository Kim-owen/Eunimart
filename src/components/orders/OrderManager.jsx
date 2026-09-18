import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { OrderStatusTabs } from './OrderStatusTabs';
import { OrderDetailDrawer } from './OrderDetailDrawer';
import { DispatchModal } from './DispatchModal';
import { fetchOrdersApi, updateOrderStatusApi, dispatchOrderApi, deleteOrderApi } from '../../services/api';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Phone,
  CreditCard,
  MapPin,
  Download,
  Printer,
  Filter,
  ArrowUpDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const initialOrdersData = [
  {
    id: 'GH-WH-9482',
    order_number: 'GH-WH-9482',
    customer_name: 'Kwame & Sons Supermarket',
    customer_phone: '+233 24 411 2233',
    customer_email: 'kwame@supermarket.gh',
    shipping_address: 'Spintex Road, Near Shell Station, Accra',
    delivery_zone_name: 'Tema & Spintex Corridor',
    status: 'pending',
    total_amount: 4620.00,
    payment_status: 'paid',
    payment_method: 'Paystack MoMo',
    payment_gateway_ref: 'PST-9482-ACC',
    created_at: '2026-09-18 14:20',
    items: [{ title: 'Royal Aroma Long Grain Rice 5kg', quantity: 5, unit_price: 924.00 }]
  },
  {
    id: 'GH-WH-8831',
    order_number: 'GH-WH-8831',
    customer_name: 'East Legon Mart',
    customer_phone: '+233 20 099 8877',
    customer_email: 'orders@eastlegonmart.com',
    shipping_address: 'Boundary Road, East Legon, Accra',
    delivery_zone_name: 'East Legon & Madina Hub',
    status: 'processing',
    total_amount: 2150.00,
    payment_status: 'paid',
    payment_method: 'Paystack MoMo',
    payment_gateway_ref: 'PST-8831-LEG',
    created_at: '2026-09-18 12:45',
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
    courier_name: 'Kofi Mensah (Rider #02)',
    courier_phone: '+233 24 488 9900',
    created_at: '2026-09-18 09:30',
    items: [{ title: 'Hisense 55" Smart 4K TV Commercial Crate', quantity: 1, unit_price: 10600.00 }]
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
    created_at: '2026-09-17 16:15',
    items: [{ title: 'Bic Blue Ballpoint Pens Carton', quantity: 1, unit_price: 1550.00 }]
  }
];

export function OrderManager() {
  const [orders, setOrders] = useState(initialOrdersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dispatchOrder, setDispatchOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    const remoteOrders = await fetchOrdersApi();
    if (remoteOrders && remoteOrders.length > 0) {
      setOrders(remoteOrders);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (order, newStatus) => {
    await updateOrderStatusApi(order.id, newStatus);
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    toast.success(`Order #${order.order_number || order.id} status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
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
      vehicleType: 'Motorbike Express (GT-4921-24)',
      status: 'out_for_delivery'
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'out_for_delivery', courier_name: riderName, courier_phone: riderPhone } : o));
    toast.success(`Courier ${riderName} dispatched for Order #${orderId}`);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Order ID,Customer,Phone,Address,Zone,Amount,Status,Payment Ref"]
        .concat(orders.map(o => `"${o.order_number || o.id}","${o.customer_name || o.buyer_name}","${o.customer_phone || o.momo_number}","${o.shipping_address || o.location}","${o.delivery_zone_name || o.location}","${o.total_amount}","${o.status}","${o.payment_gateway_ref || 'PST'}"`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AkuaMarket_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV successfully!");
  };

  const handlePrintDispatchManifest = () => {
    window.print();
  };

  const normalizeStatus = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '_');
    if (s === 'factory_processing') return 'processing';
    if (s === 'in_transit') return 'out_for_delivery';
    return s;
  };

  const counts = orders.reduce((acc, o) => {
    acc.All = (acc.All || 0) + 1;
    const norm = normalizeStatus(o.status);
    acc[norm] = (acc[norm] || 0) + 1;
    return acc;
  }, {});

  const totalVolume = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);

  const filteredOrders = orders.filter(o => {
    const normStatus = normalizeStatus(o.status);
    const matchesFilter = activeFilter === 'All' || normStatus === activeFilter;
    const matchesSearch = !searchQuery ||
      (o.order_number || o.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_name || o.buyer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_phone || o.momo_number || '').includes(searchQuery);
    const matchesPayment = paymentFilter === 'All' || (o.payment_method || '').toLowerCase().includes(paymentFilter.toLowerCase());
    return matchesFilter && matchesSearch && matchesPayment;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Top Banner & Pipeline Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Real-Time Fulfillment Pipeline
              </span>
              <span className="text-xs text-slate-400 font-mono">SQLite Automated Settlement</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Order Management & Freight Dispatches
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Track customer wholesale orders, assign motorbike and van courier dispatches, verify Paystack MoMo payments, and issue delivery OTP verifications.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export CSV
            </button>
            <button
              onClick={handlePrintDispatchManifest}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" /> Print Manifest
            </button>
            <button
              onClick={loadOrders}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Snapshot Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Pipeline Value</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">
              GH₵ {totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Awaiting Dispatch</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">
              {(counts.pending || 0) + (counts.processing || 0)} Orders
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Out with Couriers</span>
            <p className="text-lg font-black text-indigo-400 mt-0.5">
              {counts.out_for_delivery || 0} In Transit
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Delivered & Settled</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">
              {counts.delivered || 0} Fulfilled
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <OrderStatusTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {/* Enhanced Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-bold">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Gateways</option>
              <option value="momo">Paystack MoMo</option>
              <option value="stripe">Stripe Card</option>
              <option value="cash">Cash On Delivery</option>
            </select>
          </div>

          <span className="text-xs font-bold text-slate-400 font-mono">
            {filteredOrders.length} matching orders
          </span>
        </div>
      </div>

      {/* Orders Table Container */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Customer & Shipping</th>
                <th className="py-3.5 px-4 font-bold">Courier & Zone</th>
                <th className="py-3.5 px-4 font-bold">Amount & Payment</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    No orders matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const norm = normalizeStatus(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Order ID & Date */}
                      <td className="py-4 px-4 font-bold text-white font-mono">
                        <span className="text-emerald-400">#{order.order_number || order.id}</span>
                        <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {order.created_at}
                        </span>
                      </td>

                      {/* Customer Name & Phone */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-white text-xs">{order.customer_name || order.buyer_name}</p>
                        <a
                          href={`tel:${order.customer_phone || order.momo_number}`}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{order.customer_phone || order.momo_number || '+233 ...'}</span>
                        </a>
                      </td>

                      {/* Corridor & Assigned Rider */}
                      <td className="py-4 px-4">
                        <p className="text-xs text-slate-200 font-medium truncate max-w-[200px]">
                          {order.delivery_zone_name || order.shipping_address || order.location}
                        </p>
                        {order.courier_name ? (
                          <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 mt-0.5">
                            <Truck className="w-3 h-3" /> {order.courier_name}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> Unassigned Rider
                          </span>
                        )}
                      </td>

                      {/* Total Amount & Gateway Reference */}
                      <td className="py-4 px-4">
                        <span className="font-black text-emerald-400 text-sm">
                          GH₵ {Number(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          {order.payment_method || 'Paystack MoMo'}
                        </span>
                      </td>

                      {/* Status Tag */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          norm === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          norm === 'out_for_delivery' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          norm === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {norm === 'out_for_delivery' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                          <span>{order.status?.replace('_', ' ')}</span>
                        </span>
                      </td>

                      {/* Action Triggers */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="View Full Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAssignRiderClick(order)}
                            className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                            title="Assign Courier Rider"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                          {norm !== 'delivered' && (
                            <button
                              onClick={() => handleUpdateStatus(order, 'delivered')}
                              className="p-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30 transition-all cursor-pointer"
                              title="Mark Delivered"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
