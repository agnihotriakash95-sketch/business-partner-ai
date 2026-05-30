import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const PaymentSuccessPage = () => (
  <Card className="mx-auto max-w-xl border-cyan-300/20 bg-slate-950/80 text-center text-white">
    <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-300" />
    <h1 className="mt-4 font-display text-3xl font-black">Payment Successful</h1>
    <p className="mt-3 text-slate-300">Your subscription payment has been captured and saved in billing history.</p>
    <Link to="/dashboard/subscription" className="mt-6 inline-flex"><Button>Back to Billing</Button></Link>
  </Card>
);
