'use client';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import PrivateRoute from '@/components/auth/PrivateRoute';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

function MyListingsContent() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = () => {
    setLoading(true);
    api
      .get('/studios/my-listings')
      .then((res) => setStudios(res.data.studios || []))
      .catch(() => setStudios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/studios/${deleteId}`);
      toast.success('Studio deleted');
      setDeleteId(null);
      fetchListings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">My Studio Listings</h1>
          <p className="text-gray-500 mt-1">{studios.length} listing{studios.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/add-studio"><Button>Add New Studio</Button></Link>
      </div>

      {studios.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="List your first studio and start hosting creators."
          actionLabel="Add Studio"
          actionHref="/add-studio"
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Studio</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Rate</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Location</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {studios.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <Link href={`/studios/${s._id}`} className="font-medium hover:text-brand-600 line-clamp-1">
                        {s.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{s.category}</td>
                  <td className="px-4 py-3 font-medium text-brand-600">{formatCurrency(s.hourlyRate)}/hr</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{s.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/studios/edit/${s._id}`}>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600">
                          <Pencil size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(s._id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Studio">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this studio? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListingsContent />
    </PrivateRoute>
  );
}
