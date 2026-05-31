import { useState } from 'react';
import { generateMsmeReport } from '../../services/openaiService';

export const MsmeReportsPage = () => {

  const [input, setInput] = useState('');
  const [report, setReport] = useState('');

  const generate = async () => {
    const result = await generateMsmeReport(input);
    setReport(result);
  };

  return (
    <div className="p-8 text-white">

      <h1 className="mb-6 text-3xl font-bold">
        MSME Reports
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-40 w-full rounded-xl bg-slate-900 p-4"
        placeholder="Enter MSME business details..."
      />

      <button
        onClick={generate}
        className="mt-4 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
      >
        Generate Report
      </button>

      <div className="mt-6 rounded-xl bg-slate-900 p-4 whitespace-pre-wrap">
        {report}
      </div>

    </div>
  );
};