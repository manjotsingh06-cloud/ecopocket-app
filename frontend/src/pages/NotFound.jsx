import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';

export default function NotFound() {
  return (
    <div className="pt-40 pb-24 min-h-[70vh] flex items-center justify-center text-center px-6">
      <Reveal>
        <p className="font-display font-extrabold text-7xl text-forest/20 dark:text-sage-soft/20 mb-4">404</p>
        <h1 className="font-display font-bold text-2xl text-forest dark:text-sage-soft mb-3">Pocket not found</h1>
        <p className="opacity-60 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="px-6 py-3 rounded-full bg-forest text-cream text-sm font-semibold">Back to home</Link>
      </Reveal>
    </div>
  );
}
