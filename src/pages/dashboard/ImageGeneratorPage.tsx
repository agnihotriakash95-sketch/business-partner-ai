import { useState } from 'react';
import { Download, ImageIcon, Wand2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Input';
import { generateBusinessImages } from '../../services/openaiService';
import type { GeneratedImage } from '../../types';

const types = ['Logo', 'Ad Creative', 'Poster', 'Product Mockup', 'Social Media Creative', 'Business Banner'];

export const ImageGeneratorPage = () => {
  const [prompt, setPrompt] = useState('Premium blue-black futuristic logo for Business Partner AI, clean symbol, founder-led business operating system.');
  const [type, setType] = useState(types[0]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      setImages(await generateBusinessImages(prompt, type));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Image generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Image Generator</h1>
        <p className="mt-2 text-slate-400">Generate logos, ads, posters, mockups, social creatives, and business banners.</p>
      </div>
      <Card className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white">
        <div className="flex flex-wrap gap-2">
          {types.map((item) => (
            <button key={item} type="button" onClick={() => setType(item)} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${type === item ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/10 text-slate-200'}`}>
              {item}
            </button>
          ))}
        </div>
        <Textarea label="Creative prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
        <Button loading={loading} onClick={generate} className="sm:w-fit">
          <Wand2 className="h-4 w-4" /> Generate Images
        </Button>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? [0, 1, 2, 3].map((item) => (
          <Card key={item} className="grid aspect-square place-items-center border-cyan-300/20 bg-slate-950/80 text-white">
            <div className="h-16 w-16 animate-ping rounded-full border border-cyan-300/60" />
            <p className="text-sm text-cyan-200">Generating real creative...</p>
          </Card>
        )) : images.length ? images.map((image) => (
          <Card key={image.id} className="border-cyan-300/20 bg-slate-950/80 text-white">
            <img src={image.url} alt={image.prompt} className="aspect-square w-full rounded-lg object-cover" />
            <p className="mt-3 text-sm font-semibold">{image.type}</p>
            <a href={image.url} download className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/30 px-3 py-2 text-sm font-semibold text-cyan-200">
              <Download className="h-4 w-4" /> Download
            </a>
          </Card>
        )) : (
          <Card className="col-span-full grid min-h-72 place-items-center border-cyan-300/20 bg-slate-950/80 text-center text-white">
            <div>
              <ImageIcon className="mx-auto h-12 w-12 text-cyan-300" />
              <h2 className="mt-4 font-display text-2xl font-black">Image previews appear here</h2>
              <p className="mt-2 text-sm text-slate-400">Demo mode returns generated preview cards; production uses OpenAI image generation.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
