'use client';

import Link from 'next/link';
import { Aperture } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Aperture className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Studio<span className="text-brand-400">Space</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The peer-to-peer marketplace connecting creators with professional studios, stages, and creative workspaces worldwide.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/studios" className="hover:text-brand-400 transition">All Studios</Link></li>
              <li><Link href="/studios?category=Photo%20Studio" className="hover:text-brand-400 transition">Photo Studios</Link></li>
              <li><Link href="/studios?category=Film%20Stage" className="hover:text-brand-400 transition">Film Stages</Link></li>
              <li><Link href="/studios?category=Podcast%20Lounge" className="hover:text-brand-400 transition">Podcast Rooms</Link></li>
              <li><Link href="/about" className="hover:text-brand-400 transition">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/studios?category=Music%20Suite" className="hover:text-brand-400 transition">Music Suites</Link></li>
              <li><Link href="/studios?category=Art%20Workshop" className="hover:text-brand-400 transition">Art Workshops</Link></li>
              <li><Link href="/studios?category=Sound%20Stage" className="hover:text-brand-400 transition">Sound Stages</Link></li>
              <li><Link href="/add-studio" className="hover:text-brand-400 transition">Host Your Space</Link></li>
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <form
              className="flex gap-2 mb-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition"
              >
                Join
              </button>
            </form>
            <div className="flex gap-3">
              {/* X (Twitter) new logo */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition" aria-label="X">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition" aria-label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 0.774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-gray-300">Terms</Link>
            <Link href="/about" className="hover:text-gray-300">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
