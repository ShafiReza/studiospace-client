'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

const CATEGORIES = ['Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop', 'Sound Stage', 'Other'];
const AMENITY_OPTIONS = ['WiFi', 'Parking', 'Changing Room', 'Green Screen', 'Lighting Kit', 'Sound Isolation', 'Backdrop System', 'Coffee Bar', 'Makeup Station', 'Loading Dock'];

function AddStudioForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Photo Studio',
    hourlyRate: '',
    securityDeposit: '',
    maxCapacity: '',
    location: '',
    address: '',
    image: '',
    overview: '',
    amenities: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/studios', form);
      toast.success('Studio listed successfully!');
      router.push('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create studio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">Add New Studio</h1>
      <p className="text-gray-500 mb-8">List your creative space for creators to discover and book</p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Title *</label>
            <input name="title" required value={form.title} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 outline-none focus:ring-2 focus:ring-brand-500">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Hourly Rate ($) *</label>
            <input name="hourlyRate" type="number" min="0" required value={form.hourlyRate} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Security Deposit ($)</label>
            <input name="securityDeposit" type="number" min="0" value={form.securityDeposit} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Max Capacity *</label>
            <input name="maxCapacity" type="number" min="1" required value={form.maxCapacity} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Location *</label>
            <input name="location" required value={form.location} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Address</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Image URL *</label>
            <input name="image" required value={form.image} onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Detailed Overview *</label>
            <textarea name="overview" required rows={4} value={form.overview} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                    form.amenities.includes(a)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-gray-300 dark:border-gray-700 hover:border-brand-400'
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-400">Host Name (read-only)</label>
              <input readOnly value={user?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-400">Host Email (read-only)</label>
              <input readOnly value={user?.email || ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-500" />
            </div>
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full sm:w-auto">Publish Studio</Button>
      </form>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <AddStudioForm />
    </PrivateRoute>
  );
}
