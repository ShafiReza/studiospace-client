
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-6">About StudioSpace</h1>
      <div className="prose dark:prose-invert space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          StudioSpace is a peer-to-peer marketplace built for creators, filmmakers, photographers, podcasters, and musicians.
          We connect studio owners with the people who need professional creative environments — from cyclorama walls and cinema
          sound stages to intimate podcast lounges and music recording suites.
        </p>
        <p>
          Our mission is simple: make high-quality production spaces accessible, transparent, and easy to book. Hosts list their
          spaces with clear hourly rates and amenities; creators discover, filter, and reserve slots with real-time availability
          and protected booking flows.
        </p>
        <p>
          Whether you are shooting a commercial, recording a podcast episode, or hosting an art workshop, StudioSpace gives you
          the tools to find the right room and get creating faster.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">For Hosts</h2>
        <p>
          Monetize underused space, set your own rates, and welcome verified creators. Liability guidelines, equipment safety
          tips, and 24/7 support help you host with confidence.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">For Creators</h2>
        <p>
          Browse by category, compare amenities, and book instantly. Transparent pricing and double-booking prevention mean fewer
          surprises and more time on set.
        </p>
      </div>
    </div>
  );
}
