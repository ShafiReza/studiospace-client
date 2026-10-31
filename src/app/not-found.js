import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Aperture } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-6">
        <Aperture className="w-10 h-10 text-white" />
      </div>
      <h1 className="font-display text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">This set is closed</p>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        The page you are looking for does not exist or has moved. Let us get you back on set.
      </p>
      <Link href="/">
        <Button size="lg">Return to Home</Button>
      </Link>
    </div>
  );
}
