export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 ${className}`}
      />
    </div>
  );
}
