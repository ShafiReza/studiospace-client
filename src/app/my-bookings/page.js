'use client';

import { useEffect, useState } from 'react';
import PrivateRoute from '@/components/auth/PrivateRoute';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  Confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  Cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

function MyBookingsContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    api
      .get('/bookings/my-bookings')
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const downloadInvoice = (b) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('StudioSpace Booking Invoice', 20, 25);
    doc.setFontSize(11);
    doc.text(`Booking ID: ${b._id}`, 20, 40);
    doc.text(`Studio: ${b.studioTitle || b.studio?.title}`, 20, 48);
    doc.text(`Guest: ${b.userName} (${b.userEmail})`, 20, 56);
    doc.text(`Start: ${formatDate(b.startTime)}`, 20, 64);
    doc.text(`End: ${formatDate(b.endTime)}`, 20, 72);
    doc.text(`Hours: ${b.totalHours}`, 20, 80);
    doc.text(`Rate: $${b.hourlyRate}/hr`, 20, 88);
    doc.text(`Total: $${b.totalAmount}`, 20, 96);
    doc.text(`Status: ${b.status}`, 20, 104);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 120);
    doc.save(`invoice-${b._id.slice(-6)}.pdf`);
    toast.success('Invoice downloaded');
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-gray-500 mb-8">Manage your studio reservations</p>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Explore studios and book your first session."
          actionLabel="Explore Studios"
          actionHref="/studios"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <img
                src={b.studioImage || b.studio?.image}
                alt=""
                className="w-full sm:w-32 h-24 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg truncate">{b.studioTitle || b.studio?.title}</h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(b.startTime)} → {formatDate(b.endTime)}
                </p>
                <p className="text-sm mt-1">
                  {b.totalHours} hrs · <span className="font-semibold text-brand-600">{formatCurrency(b.totalAmount)}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(b.status === 'Pending' || b.status === 'Confirmed') && (
                    <Button size="sm" variant="danger" onClick={() => handleCancel(b._id)}>
                      Cancel Booking
                    </Button>
                  )}
                  {b.status === 'Confirmed' && (
                    <Button size="sm" variant="secondary" onClick={() => downloadInvoice(b)}>
                      Download Invoice
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookingsContent />
    </PrivateRoute>
  );
}
