'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import api from '@/lib/api';
import StudioCard from '@/components/studios/StudioCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Camera, Clapperboard, Mic, Music, Palette, Search, Calendar, Zap, Sparkles, Shield, Users, Headphones, Clock } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600',
    title: 'Book Pro Studios in Minutes',
    subtitle: 'From cycloramas to sound stages — find the perfect creative space for your next production.',
  },
  {
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600',
    title: 'Host Your Space. Earn More.',
    subtitle: 'List your studio, set your rates, and welcome filmmakers, podcasters, and artists from around the world.',
  },
  {
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600',
    title: 'Create Without Limits',
    subtitle: 'Transparent pricing, real-time availability, and verified hosts so you can focus on making great work.',
  },
];

const categories = [
  { name: 'Photo Studio', icon: Camera, color: 'from-pink-500 to-rose-600', query: 'Photo Studio' },
  { name: 'Film Stage', icon: Clapperboard, color: 'from-violet-500 to-purple-600', query: 'Film Stage' },
  { name: 'Podcast Lounge', icon: Mic, color: 'from-amber-500 to-orange-600', query: 'Podcast Lounge' },
  { name: 'Music Suite', icon: Music, color: 'from-emerald-500 to-teal-600', query: 'Music Suite' },
  { name: 'Art Workshop', icon: Palette, color: 'from-sky-500 to-blue-600', query: 'Art Workshop' },
];

const steps = [
  { icon: Search, title: 'Discover Spaces', desc: 'Browse verified studios by category, location, and amenities.' },
  { icon: Calendar, title: 'Select Shoot Hours', desc: 'Pick the exact date and hours that fit your production schedule.' },
  { icon: Zap, title: 'Book Instantly', desc: 'Secure your slot with transparent pricing and instant confirmation flow.' },
  { icon: Sparkles, title: 'Create & Produce', desc: 'Show up, create your best work, and leave a review for the community.' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/studios/featured')
      .then((res) => setFeatured(res.data.studios || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[520px] md:h-[600px]"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-full w-full">
                <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                  <div className="max-w-xl text-white">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-lg text-gray-200 leading-relaxed">{slide.subtitle}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href="/studios">
                        <Button size="lg">Explore Studios</Button>
                      </Link>
                      <Link href="/add-studio">
                        <Button size="lg" variant="secondary">
                          Host Your Space
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Studios */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Featured Studios
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Top-rated and newest creative spaces</p>
            </div>
            <Link href="/studios" className="hidden sm:block text-brand-600 font-medium hover:underline">
              View all →
            </Link>
          </div>
          {loading ? (
            <Spinner />
          ) : featured.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No studios yet. Be the first to list one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((s) => (
                <StudioCard key={s._id} studio={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3">
            Browse by Category
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
            Find the exact type of space your project needs
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.query)}`}
                className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}
                >
                  <cat.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Booking Works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">How Booking Works</h2>
          <p className="text-center text-brand-100 mb-12">Four simple steps from discovery to production</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                  <step.icon size={26} />
                </div>
                <div className="text-brand-200 text-sm font-medium mb-1">Step {i + 1}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-brand-100 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Guarantee */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3">
            Host Guarantee & Creator Support
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            We protect both sides of every booking so you can create with confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Liability Protection', desc: 'Coverage options and clear terms for every reservation.' },
              { icon: Users, title: 'Verified Profiles', desc: 'Hosts and guests are verified for safer collaborations.' },
              { icon: Headphones, title: '24/7 Host Support', desc: 'Our team is available around the clock for urgent issues.' },
              { icon: Clock, title: 'Equipment Safety', desc: 'Guidelines and checklists to keep gear and spaces secure.' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center mb-4">
                  <item.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
