import { useState } from 'react';
import { sendBusinessChatMessage } from '../../services/openaiService';

export const VoiceAssistantPage = () => {

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const askAI = async () => {
    const result = await sendBusinessChatMessage(message);
    setResponse(result);
  };

  return (
    <div className="p-8 text-white">

      <h1 className="mb-6 text-3xl font-bold">
        AI Voice Assistant
      </h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask AI anything..."
        className="w-full rounded-xl bg-slate-900 p-4"
      />

      <button
        onClick={askAI}
        className="mt-4 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
      >
        Ask AI
      </button>

      <div className="mt-6 rounded-xl bg-slate-900 p-4">
        {response}
      </div>

    </div>
  );
};