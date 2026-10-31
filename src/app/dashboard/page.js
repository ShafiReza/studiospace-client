'use client';


import Link from 'next/link';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, List, Calendar, LayoutDashboard } from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();

  const cards = [
    { href: '/add-studio', icon: PlusCircle, title: 'Add New Studio', desc: 'List a new creative space' },
    { href: '/my-listings', icon: List, title: 'My Listings', desc: 'Manage your studio listings' },
    { href: '/my-bookings', icon: Calendar, title: 'My Bookings', desc: 'View and manage reservations' },
    { href: '/studios', icon: LayoutDashboard, title: 'Explore Studios', desc: 'Browse all available spaces' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.name}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-400 hover:shadow-lg transition"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
              <c.icon size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}
