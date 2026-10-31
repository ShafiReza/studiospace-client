'use client';


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'sonner';

const CATEGORIES = ['Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop', 'Sound Stage', 'Other'];

function EditStudioForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    api
      .get(`/studios/${id}`)
      .then((res) => {
        const s = res.data.studio;
        if (s.hostEmail !== user?.email) {
          toast.error('Not authorized');
          router.push('/my-listings');
          return;
        }
        setForm({
          title: s.title,
          category: s.category,
          hourlyRate: s.hourlyRate,
          securityDeposit: s.securityDeposit || 0,
          maxCapacity: s.maxCapacity,
          location: s.location,
          address: s.address || '',
          image: s.image,
          overview: s.overview,
          amenities: s.amenities || [],
        });
      })
      .catch(() => router.push('/my-listings'))
      .finally(() => setLoading(false));
  }, [id, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/studios/${id}`, form);
      toast.success('Studio updated');
      router.push('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Update Studio</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input name="title" required value={form.title} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 outline-none">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Hourly Rate ($)</label>
            <input name="hourlyRate" type="number" required value={form.hourlyRate} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Max Capacity</label>
            <input name="maxCapacity" type="number" required value={form.maxCapacity} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Location</label>
            <input name="location" required value={form.location} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Image URL</label>
          <input name="image" required value={form.image} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Overview</label>
          <textarea name="overview" required rows={4} value={form.overview} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-gray-400">
          <div>
            <label className="block text-sm mb-1.5">Host Name</label>
            <input readOnly value={user?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950" />
          </div>
          <div>
            <label className="block text-sm mb-1.5">Host Email</label>
            <input readOnly value={user?.email || ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950" />
          </div>
        </div>
        <Button type="submit" loading={saving}>Update Studio</Button>
      </form>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditStudioForm />
    </PrivateRoute>
  );
}
