import { useEffect, useState } from 'react';
import { Clock, Download, History, ImageIcon, Trash2, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { OpenAIKeyWarning } from '../../components/ai/OpenAIKeyWarning';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Input';
import { generateBusinessImages, isOpenAIConfigured } from '../../services/openaiService';
import type { GeneratedImage } from '../../types';

const types = ['Logo', 'Ad Creative', 'Poster', 'Product Mockup', 'Social Media Creative', 'Business Banner', 'Presentation Banner'];
const HISTORY_KEY = 'bpa-image-history';

const loadHistory = (): GeneratedImage[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as GeneratedImage[]) : [];
  } catch {
    return [];
  }
};

export const ImageGeneratorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState(types[0]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [history, setHistory] = useState<GeneratedImage[]>(() => loadHistory());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 24)));
  }, [history]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const generated = await generateBusinessImages(prompt, type);
      setImages(generated);
      setHistory((items) => [...generated, ...items].slice(0, 24));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Image generation failed');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  if (!isOpenAIConfigured()) {
    return (
      <div className="grid gap-6">
        <OpenAIKeyWarning />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Image Studio</h1>
        <p className="mt-2 text-slate-400">HD logos, branding, ads, posters, mockups, and banners via OpenAI DALL·E 3.</p>
      </div>
      <Card className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {types.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setType(item)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                type === item ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/10 text-slate-200 hover:border-cyan-300/40'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <Textarea
          label="Creative prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Describe your brand, audience, colors, and style..."
        />
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
        <Button loading={loading} onClick={generate} className="sm:w-fit">
          <Wand2 className="h-4 w-4" /> Generate HD Images
        </Button>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {loading
          ? [0, 1].map((item) => (
              <Card key={item} className="aspect-square animate-pulse border-cyan-300/20 bg-white/5" />
            ))
          : images.map((image) => (
              <motion.div key={image.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="overflow-hidden border-cyan-300/20 bg-slate-950/80 text-white">
                  <img src={image.url} alt={image.prompt} className="aspect-square w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-semibold text-cyan-200">{image.type}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">{image.prompt}</p>
                    <a
                      href={image.url}
                      download={`${image.type}-${image.id}.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-3 py-2.5 text-sm font-bold text-slate-950"
                    >
                      <Download className="h-4 w-4" /> Download HD
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
        {!loading && !images.length ? (
          <Card className="col-span-full grid min-h-72 place-items-center border-cyan-300/20 bg-slate-950/80 text-center text-white">
            <div>
              <ImageIcon className="mx-auto h-12 w-12 text-cyan-300" />
              <h2 className="mt-4 font-display text-2xl font-black">Your creatives appear here</h2>
              <p className="mt-2 text-sm text-slate-400">Enter a prompt and generate production-quality business visuals.</p>
            </div>
          </Card>
        ) : null}
      </div>

      {history.length ? (
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-cyan-300" />
              <h2 className="font-display text-xl font-bold">Image History</h2>
            </div>
            <button type="button" onClick={clearHistory} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-300">
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {history.slice(0, 8).map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  setPrompt(image.prompt);
                  setType(image.type);
                }}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-left transition hover:border-cyan-300/40"
              >
                <img src={image.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                <p className="mt-2 flex items-center gap-1 truncate text-xs text-slate-400">
                  <Clock className="h-3 w-3" /> {new Date(image.createdAt).toLocaleDateString('en-IN')}
                </p>
              </button>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
};
