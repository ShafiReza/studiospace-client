'use client';


import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { Aperture } from 'lucide-react';

export default function RegisterPage() {
  const { register, googleLogin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (isAuthenticated) {
    router.replace('/');
    return null;
  }

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain a lowercase letter';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validatePassword(form.password);
    if (err) {
      setPasswordError(err);
      toast.error(err);
      return;
    }
    setLoading(true);
    try {
      await register(form);
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      // Redirects to Better Auth Google OAuth (requires GOOGLE_CLIENT_ID/SECRET)
      await googleLogin();
    } catch (err) {
      toast.error(err.message || 'Google login failed. Configure GOOGLE_CLIENT_ID or use email login.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center mb-4">
            <Aperture className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Join StudioSpace today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input name="name" required value={form.name} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Photo URL</label>
            <input name="photoURL" value={form.photoURL} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input name="password" type="password" required value={form.password} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Min 6 chars, upper & lower" />
            {passwordError && <p className="mt-1.5 text-sm text-red-500">{passwordError}</p>}
          </div>
          <Button type="submit" className="w-full" loading={loading}>Register</Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span></div>
          </div>

          <Button type="button" variant="secondary" className="w-full" onClick={handleGoogle} loading={loading}>
            Continue with Google
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
