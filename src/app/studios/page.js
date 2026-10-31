'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import StudioCard from '@/components/studios/StudioCard';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop', 'Sound Stage'];

function StudiosContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    if (sort === 'price-asc') params.set('sort', 'price-asc');
    if (sort === 'price-desc') params.set('sort', 'price-desc');
    if (sort === 'rating') params.set('sort', 'rating');

    api
      .get(`/studios?${params.toString()}`)
      .then((res) => setStudios(res.data.studios || []))
      .catch(() => setStudios([]))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Explore Studios
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Find the perfect creative workspace for your next project</p>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : studios.length === 0 ? (
        <EmptyState
          title="No studios found"
          description="Try adjusting your filters or search terms."
          actionLabel="Clear filters"
          actionHref="/studios"
        />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{studios.length} studio{studios.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <StudiosContent />
    </Suspense>
  );
}
