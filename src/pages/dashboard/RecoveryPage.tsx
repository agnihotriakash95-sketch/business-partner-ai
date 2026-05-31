import { useState } from 'react';
import { generateRecoveryPlan } from '../../services/openaiService';

export const RecoveryPage = () => {

  const [input, setInput] = useState('');
  const [plan, setPlan] = useState('');

  const generate = async () => {
    const result = await generateRecoveryPlan(input);
    setPlan(result);
  };

  return (
    <div className="p-8 text-white">

      <h1 className="mb-6 text-3xl font-bold">
        Recovery Plan
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-40 w-full rounded-xl bg-slate-900 p-4"
        placeholder="Describe business problem..."
      />

      <button
        onClick={generate}
        className="mt-4 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
      >
        Generate Recovery Plan
      </button>

      <div className="mt-6 rounded-xl bg-slate-900 p-4 whitespace-pre-wrap">
        {plan}
      </div>

    </div>
  );
};