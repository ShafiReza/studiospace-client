'use client';


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { MapPin, Star, Users, Shield, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

export default function StudioDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState({ startTime: '', endTime: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/studios/${id}`)
      .then((res) => setStudio(res.data.studio))
      .catch(() => setStudio(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to book');
      router.push('/login');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        studioId: id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        notes: booking.notes,
      });
      toast.success('Booking request submitted!');
      setBookingOpen(false);
      router.push('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!studio) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Studio not found</h1>
        <Link href="/studios"><Button>Back to Studios</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img src={studio.image} alt={studio.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 mb-3">
              {studio.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {studio.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><MapPin size={16} /> {studio.location}</span>
              <span className="flex items-center gap-1"><Star size={16} className="fill-amber-400 text-amber-400" /> {Number(studio.rating).toFixed(1)} ({studio.reviewCount || 0} reviews)</span>
              <span className="flex items-center gap-1"><Users size={16} /> Up to {studio.maxCapacity} people</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{studio.overview}</p>
          </div>
          {studio.amenities?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {studio.amenities.map((a) => (
                  <span key={a} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">{a}</span>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <img
              src={studio.hostId?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(studio.hostName)}&background=0c8ee9&color=fff`}
              alt={studio.hostName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Hosted by {studio.hostName}</p>
              <p className="text-sm text-gray-500">{studio.hostEmail}</p>
            </div>
          </div>
        </div>

        {/* Booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
            <p className="text-3xl font-bold text-brand-600">
              {formatCurrency(studio.hourlyRate)}
              <span className="text-base font-normal text-gray-500"> / hour</span>
            </p>
            {studio.securityDeposit > 0 && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Shield size={14} /> Security deposit: {formatCurrency(studio.securityDeposit)}
              </p>
            )}
            <Button className="w-full mt-6" size="lg" onClick={() => setBookingOpen(true)}>
              Book Workspace Now
            </Button>
            <p className="mt-3 text-xs text-center text-gray-400 flex items-center justify-center gap-1">
              <Clock size={12} /> You won&apos;t be charged yet
            </p>
          </div>
        </div>
      </div>

      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Book this studio" size="md">
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Start time</label>
            <input
              type="datetime-local"
              required
              value={booking.startTime}
              onChange={(e) => setBooking({ ...booking, startTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">End time</label>
            <input
              type="datetime-local"
              required
              value={booking.endTime}
              onChange={(e) => setBooking({ ...booking, endTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Notes (optional)</label>
            <textarea
              rows={3}
              value={booking.notes}
              onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Any special requirements..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={submitting}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
