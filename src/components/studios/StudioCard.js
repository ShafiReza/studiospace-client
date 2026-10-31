'use client';
import Link from 'next/link';
import { MapPin, Star, Heart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function StudioCard({ studio, onWishlistChange }) {
  const { isAuthenticated } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save studios');
      return;
    }
    setBusy(true);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${studio._id}`);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post('/wishlist', { studioId: studio._id });
        setWishlisted(true);
        toast.success('Saved to wishlist');
      }
      onWishlistChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link
      href={`/studios/${studio._id}`}
      className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={studio.image}
          alt={studio.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-100 backdrop-blur">
          {studio.category}
        </span>
        <button
          onClick={toggleWishlist}
          disabled={busy}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur flex items-center justify-center hover:scale-110 transition shadow"
        >
          <Heart
            size={18}
            className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}
          />
        </button>
        {studio.rating && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-black/70 text-white">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {Number(studio.rating).toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition">
          {studio.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <MapPin size={14} /> {studio.location}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <p className="font-bold text-brand-600 dark:text-brand-400">
            {formatCurrency(studio.hourlyRate)}
            <span className="text-xs font-normal text-gray-500"> / hr</span>
          </p>
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
