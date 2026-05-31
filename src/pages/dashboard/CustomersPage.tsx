import { FormEvent, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import type { Customer } from '../../types';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import { currency, formatDate } from '../../utils/formatters';

export const CustomersPage = () => {
  const { customers, addCustomer } = useBusinessData();
  const [name, setName] = useState('');
  const [amountDue, setAmountDue] = useState(0);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    addCustomer({
      name,
      company: name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@business.local`,
      phone: '',
      amountDue,
      paymentStatus: amountDue > 0 ? 'pending' : 'paid',
      dueDate: new Date().toISOString(),
    });
    setName('');
    setAmountDue(0);
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Customer Management</h1>
        <p className="mt-2 text-slate-400">Add customers, track payment status, and monitor pending dues for AI collection insights.</p>
      </div>
      <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
        <form className="grid gap-4 md:grid-cols-[1fr_220px_auto]" onSubmit={submit}>
          <Input label="Customer Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Input label="Amount Due" type="number" value={amountDue} onChange={(event) => setAmountDue(Number(event.target.value))} />
          <Button className="self-end">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </Card>
      <div className="grid gap-4">
        {customers.length ? (
          customers.map((customer) => (
            <Card key={customer.id} className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white md:grid-cols-[1fr_auto_auto] md:items-center">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300/15 text-cyan-300">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-slate-400">{customer.email}</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{currency(customer.amountDue)}</p>
                <p className="text-slate-400">Due {formatDate(customer.dueDate)}</p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${
                  customer.paymentStatus === 'paid'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : customer.paymentStatus === 'overdue'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-amber-400/10 text-amber-300'
                }`}
              >
                {customer.paymentStatus}
              </span>
            </Card>
          ))
        ) : (
          <Card className="border-cyan-300/20 bg-slate-950/80 p-8 text-center text-slate-400">
            No customers yet. Add your first customer to enable CRM and collection AI.
          </Card>
        )}
      </div>
    </div>
  );
};
