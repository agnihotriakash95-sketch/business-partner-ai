import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const PaymentFailedPage = () => (
  <Card className="mx-auto max-w-xl border-cyan-300/20 bg-slate-950/80 text-center text-white">
    <XCircle className="mx-auto h-14 w-14 text-red-300" />
    <h1 className="mt-4 font-display text-3xl font-black">Payment Failed</h1>
    <p className="mt-3 text-slate-300">The transaction was cancelled or could not be completed. Please retry checkout.</p>
    <Link to="/dashboard/subscription" className="mt-6 inline-flex"><Button>Retry Payment</Button></Link>
  </Card>
);
