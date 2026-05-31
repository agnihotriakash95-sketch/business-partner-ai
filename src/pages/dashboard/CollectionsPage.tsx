import { useState } from 'react';
import { generateCollectionMessage } from '../../services/openaiService';

export const CollectionsPage = () => {

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const generate = async () => {
    const result = await generateCollectionMessage(
      name,
      Number(amount)
    );

    setMessage(result);
  };

  return (
    <div className="p-8 text-white">

      <h1 className="mb-6 text-3xl font-bold">
        Collections
      </h1>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full rounded-xl bg-slate-900 p-4"
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 w-full rounded-xl bg-slate-900 p-4"
      />

      <button
        onClick={generate}
        className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
      >
        Generate Message
      </button>

      <div className="mt-6 rounded-xl bg-slate-900 p-4">
        {message}
      </div>

    </div>
  );
};