import { useState } from 'react';
import { sendBusinessChatMessage } from '../../services/openaiService';

export const AIChatPage = () => {

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {

    if (!message) return;

    setLoading(true);

    try {

      const result = await sendBusinessChatMessage(message);

      setResponse(result);

    } catch (error) {

      console.error(error);

      setResponse('AI Error');

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-black p-8 text-white">

      <div className="mx-auto max-w-4xl rounded-3xl border border-cyan-500/20 bg-slate-950 p-8">

        <h1 className="mb-6 text-4xl font-bold text-cyan-400">
          AI Business Chat
        </h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Business Partner AI anything..."
          className="h-40 w-full rounded-2xl bg-slate-900 p-4 outline-none"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="mt-4 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
        >
          {loading ? 'Thinking...' : 'Send Message'}
        </button>

        <div className="mt-8 rounded-2xl bg-slate-900 p-6 whitespace-pre-wrap">

          {response || 'AI response will appear here...'}

        </div>

      </div>

    </div>
  );
};