import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';
import { fetchDeliveryZonesApi, saveDeliveryZoneApi, deleteDeliveryZoneApi } from '../../services/api';
import { toast } from 'sonner';
import {
  Truck,
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  Calculator,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

const REGIONAL_PRESETS = [
  { zone_name: "Airport Hills & Cantonments", delivery_fee: "30.00", estimated_hours: "Same Day (1-2 Hrs)", is_active: true },
  { zone_name: "Takoradi & Western Corridors", delivery_fee: "65.00", estimated_hours: "24-48 Hours Freight", is_active: true },
  { zone_name: "Kasoa & Central Border Hub", delivery_fee: "40.00", estimated_hours: "Same Day (4-6 Hrs)", is_active: true },
  { zone_name: "Sunyani & Brong Regional", delivery_fee: "75.00", estimated_hours: "48 Hours Inter-City", is_active: true }
];

export function DeliveryZoneManager() {
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [formData, setFormData] = useState({
    zone_name: '',
    delivery_fee: '',
    estimated_hours: '24-48 Hours',
    is_active: true
  });

  // Simulator Calculator State
  const [calcZone, setCalcZone] = useState('');
  const [calcSubtotal, setCalcSubtotal] = useState(250);

  const loadZones = async () => {
    const data = await fetchDeliveryZonesApi();
    if (data) {
      setZones(data);
      if (data.length > 0 && !calcZone) {
        setCalcZone(data[0].id);
      }
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleOpenCreate = () => {
    setSelectedZone(null);
    setFormData({ zone_name: '', delivery_fee: '25.00', estimated_hours: 'Same Day (2-4 Hrs)', is_active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone) => {
    setSelectedZone(zone);
    setFormData({
      zone_name: zone.zone_name,
      delivery_fee: zone.delivery_fee,
      estimated_hours: zone.estimated_hours || '24-48 Hours',
      is_active: Boolean(zone.is_active)
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: selectedZone ? selectedZone.id : `zone-${Date.now()}`,
      ...formData,
      delivery_fee: Number(formData.delivery_fee)
    };
    await saveDeliveryZoneApi(payload);
    await loadZones();
    toast.success(`Delivery Zone '${formData.zone_name}' saved`);
    setIsModalOpen(false);
  };

  const handleDeleteZone = async (zoneId, zoneName) => {
    if (window.confirm(`Delete delivery zone "${zoneName}"?`)) {
      await deleteDeliveryZoneApi(zoneId);
      setZones(prev => prev.filter(z => z.id !== zoneId));
      toast.success(`Zone "${zoneName}" deleted`);
    }
  };

  const handleApplyPreset = async (preset) => {
    await saveDeliveryZoneApi(preset);
    await loadZones();
    toast.success(`Added preset "${preset.zone_name}"!`);
  };

  // Calculator lookup
  const selectedCalcZoneObj = zones.find(z => String(z.id) === String(calcZone)) || zones[0];
  const calculatedFee = selectedCalcZoneObj ? Number(selectedCalcZoneObj.delivery_fee || 0) : 0;
  const isFreeDelivery = calcSubtotal >= 1000;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Top Banner & Logistics Health */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Greater Accra & Inter-City Corridors
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-Time SLA Engine</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Delivery Zones & Freight Rate Matrix
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Define regional delivery perimeters, motorbike courier fees, next-day inter-city freight rates, and customer fulfillment SLAs across Ghana.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Delivery Zone
            </button>
          </div>
        </div>

        {/* Quick Corridor Snapshot Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Configured Zones</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{zones.length} Active Corridors</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Metro Same-Day SLA</span>
            <p className="text-lg font-black text-white mt-0.5">2-4 Hours Average</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Base Delivery Rate</span>
            <p className="text-lg font-black text-indigo-400 mt-0.5">GH₵ 25.00 Accra</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Courier Network</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">Motorbike & Van Fleet</p>
          </div>
        </div>
      </div>

      {/* Interactive Freight Rate Calculator Simulator & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Freight Rate Calculator Card (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Interactive Customer Freight Calculator</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Preview Cart Calculation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold">Select Destination Zone</label>
              <select
                value={calcZone}
                onChange={(e) => setCalcZone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>{z.zone_name} (GH₵{z.delivery_fee})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold">Simulated Order Subtotal (GH₵)</label>
              <input
                type="number"
                value={calcSubtotal}
                onChange={(e) => setCalcSubtotal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Calculator Output Pill */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Computed Shipping Fee</span>
              <p className="text-base font-black text-emerald-400 mt-0.5">
                {isFreeDelivery ? 'GH₵ 0.00 (FREE PROMO APPLIED)' : `GH₵ ${calculatedFee.toFixed(2)}`}
              </p>
              <span className="text-[10px] text-slate-400">
                ETA: {selectedCalcZoneObj?.estimated_hours || '24-48 Hours'}
              </span>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              isFreeDelivery ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {isFreeDelivery ? 'Tier Over GH₵1,000' : 'Standard Rate'}
            </span>
          </div>
        </div>

        {/* Quick Regional Presets (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Quick Regional Presets</span>
            </h3>
            <span className="text-[10px] text-slate-400">Click to add zone</span>
          </div>

          <div className="space-y-2">
            {REGIONAL_PRESETS.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between cursor-pointer transition-all group text-xs"
              >
                <div>
                  <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                    {preset.zone_name}
                  </h4>
                  <p className="text-[10px] text-slate-400">{preset.estimated_hours}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-400">GH₵ {preset.delivery_fee}</span>
                  <span className="p-1 rounded-lg bg-slate-700 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-300">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Delivery Zones Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map(zone => (
          <GlassCard key={zone.id} hover className="space-y-4 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  zone.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {zone.is_active ? 'Active Corridor' : 'Disabled'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {zone.zone_name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{zone.estimated_hours}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Delivery Rate</span>
                <p className="text-lg font-black text-emerald-400">
                  GH₵ {Number(zone.delivery_fee || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(zone)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Edit Zone"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteZone(zone.id, zone.zone_name)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                  title="Delete Zone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedZone ? 'Edit Delivery Zone' : 'Create Delivery Zone'}>
        <form onSubmit={handleSave} className="space-y-4 text-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Zone Region Name</label>
            <input
              type="text"
              required
              value={formData.zone_name}
              onChange={(e) => setFormData(prev => ({ ...prev, zone_name: e.target.value }))}
              placeholder="e.g. Central Accra Metro"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Delivery Fee (GH₵)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.delivery_fee}
                onChange={(e) => setFormData(prev => ({ ...prev, delivery_fee: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Delivery ETA</label>
              <input
                type="text"
                required
                value={formData.estimated_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded accent-emerald-500 w-4 h-4"
            />
            Active Delivery Zone
          </label>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
            >
              Save Zone
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
