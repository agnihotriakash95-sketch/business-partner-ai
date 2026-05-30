import { FormEvent, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { demoCustomers } from '../../data/demoData';
import type { Customer } from '../../types';
import { currency, formatDate } from '../../utils/formatters';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState(demoCustomers);
  const [name, setName] = useState('');
  const [amountDue, setAmountDue] = useState(0);

  const addCustomer = (event: FormEvent) => {
    event.preventDefault();
    const customer: Customer = {
      id: crypto.randomUUID(),
      ownerId: 'demo-user',
      name,
      company: name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
      phone: '+91 7651876597',
      amountDue,
      paymentStatus: amountDue > 0 ? 'pending' : 'paid',
      dueDate: new Date().toISOString(),
    };
    setCustomers((items) => [customer, ...items]);
    setName('');
    setAmountDue(0);
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Customer Management</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Add customers, track payment status, and monitor pending dues.</p>
      </div>
      <Card>
        <form className="grid gap-4 md:grid-cols-[1fr_220px_auto]" onSubmit={addCustomer}>
          <Input label="Customer Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Input label="Amount Due" type="number" value={amountDue} onChange={(event) => setAmountDue(Number(event.target.value))} />
          <Button className="self-end">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </Card>
      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-gold-400/15 text-gold-500"><Users className="h-5 w-5" /></span>
              <div>
                <h3 className="font-semibold">{customer.name}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{customer.email} · {customer.phone}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="font-semibold">{currency(customer.amountDue)}</p>
              <p className="text-neutral-500 dark:text-neutral-400">Due {formatDate(customer.dueDate)}</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${customer.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : customer.paymentStatus === 'overdue' ? 'bg-red-500/10 text-red-500' : 'bg-gold-400/10 text-gold-600 dark:text-gold-300'}`}>
              {customer.paymentStatus}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};
