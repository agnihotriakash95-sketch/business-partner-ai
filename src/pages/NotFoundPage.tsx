import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => (
  <div className="grid min-h-screen place-items-center bg-neutral-50 px-4 text-center text-neutral-950 dark:bg-obsidian dark:text-white">
    <div>
      <p className="font-display text-7xl font-black text-gold-400">404</p>
      <h1 className="mt-4 font-display text-3xl font-black">Page not found</h1>
      <Link to="/dashboard" className="mt-6 inline-flex">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  </div>
);
