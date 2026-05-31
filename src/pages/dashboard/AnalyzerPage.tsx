import { useState } from 'react';
import { analyzeBusiness } from '../../services/openaiService';

export const AnalyzerPage = () => {

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    const response = await analyzeBusiness(input);
    setResult(response);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold">
        AI Business Analyzer
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-40 w-full rounded-xl bg-slate-900 p-4"
        placeholder="Enter business details..."
      />

      <button
        onClick={handleAnalyze}
        className="mt-4 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
      >
        Analyze
      </button>

      <div className="mt-6 rounded-xl bg-slate-900 p-4">
        {result}
      </div>
    </div>
  );
};