import { useState } from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { demoCustomers } from '../../data/demoData';
import { generateCollectionMessage } from '../../services/openaiService';
import type { CollectionMessage } from '../../types';
import { currency } from '../../utils/formatters';

export const CollectionsPage = () => {
  const pending = demoCustomers.filter((customer) => customer.paymentStatus !== 'paid');
  const [message, setMessage] = useState<CollectionMessage | null>(null);
  const [loadingId, setLoadingId] = useState('');
  const [error, setError] = useState('');

  const generate = async (customerName: string, amountDue: number, id: string) => {
    setLoadingId(id);
    setError('');
    try {
      setMessage(await generateCollectionMessage(customerName, amountDue));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Collection message generation failed');
    } finally {
      setLoadingId('');
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Collection Assistant</h1>
        <p className="mt-2 text-slate-400">
          Track pending payments and generate WhatsApp plus email follow-up templates.
        </p>
      </div>
      {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <div className="grid gap-4">
          {pending.map((customer) => (
            <Card key={customer.id} className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-slate-400">{customer.company}</p>
                </div>
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase text-red-400">
                  {customer.paymentStatus}
                </span>
              </div>
              <p className="text-2xl font-black">{currency(customer.amountDue)}</p>
              <Button
                loading={loadingId === customer.id}
                onClick={() => generate(customer.name, customer.amountDue, customer.id)}
              >
                <MessageCircle className="h-4 w-4" /> Generate Follow-up
              </Button>
            </Card>
          ))}
        </div>
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <h2 className="font-display text-xl font-bold">Generated Reminder</h2>
          {message ? (
            <div className="mt-5 grid gap-4">
              <div className="rounded-lg bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-4 w-4 text-cyan-300" /> WhatsApp
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{message.whatsapp}</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <Mail className="h-4 w-4 text-cyan-300" /> Email
                </div>
                <p className="text-sm font-semibold">{message.emailSubject}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{message.emailBody}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">Select any pending customer to generate a reminder.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
