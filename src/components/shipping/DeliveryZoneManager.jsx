import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';
import { fetchDeliveryZonesApi, saveDeliveryZoneApi } from '../../services/api';
import { toast } from 'sonner';
import { Truck, MapPin, Plus, Edit, CheckCircle2, Clock, DollarSign } from 'lucide-react';

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

  useEffect(() => {
    async function loadZones() {
      const data = await fetchDeliveryZonesApi();
      if (data) setZones(data);
    }
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
    setZones(prev => {
      const exists = prev.some(z => z.id === payload.id);
      if (exists) return prev.map(z => z.id === payload.id ? payload : z);
      return [...prev, payload];
    });
    toast.success(`Delivery Zone '${formData.zone_name}' saved`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Delivery & Shipping Zone Configuration</h2>
          <p className="text-xs text-slate-400 mt-1">Define geographic shipping zones, customizable rates, and delivery ETAs.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Delivery Zone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map(zone => (
          <GlassCard key={zone.id} hover className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                zone.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {zone.is_active ? 'Active Zone' : 'Disabled'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{zone.zone_name}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> {zone.estimated_hours}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Delivery Fee</span>
                <p className="text-lg font-black text-emerald-400">
                  GH₵ {Number(zone.delivery_fee || 0).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleOpenEdit(zone)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

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
