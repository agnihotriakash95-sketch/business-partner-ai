import { ChangeEvent, useRef, useState } from 'react';
import { Camera, FileScan, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { extractTextFromFile } from '../../services/ocrService';
import type { UploadedAsset } from '../../types';

export const UploadScannerPage = () => {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [cameraUrl, setCameraUrl] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setLoading(true);
    try {
      const extracted = await Promise.all(files.map(extractTextFromFile));
      setAssets((current) => [...extracted, ...current]);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setCameraUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Camera & Upload Scanner</h1>
        <p className="mt-2 text-slate-400">Upload images, bills, invoices, and business documents with OCR-style extraction.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <Card className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white">
          <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-cyan-300/40 bg-white/5 p-8 text-center">
            <Upload className="h-10 w-10 text-cyan-300" />
            <span className="mt-3 font-semibold">Upload bills, invoices, images, PDFs</span>
            <input className="hidden" type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFiles} />
          </label>
          <Button loading={loading} variant="secondary">Scan Uploaded Files</Button>
          <div className="grid gap-3">
            <Button type="button" onClick={startCamera}><Camera className="h-4 w-4" /> Start Camera</Button>
            <video ref={videoRef} autoPlay playsInline className="aspect-video rounded-lg bg-black object-cover" />
            <Button type="button" variant="secondary" onClick={capture}>Capture Preview</Button>
            {cameraUrl ? <img src={cameraUrl} alt="Camera capture" className="rounded-lg" /> : null}
          </div>
        </Card>
        <div className="grid gap-4">
          {assets.length ? assets.map((asset) => (
            <Card key={asset.id} className="border-cyan-300/20 bg-slate-950/80 text-white">
              <div className="flex items-start gap-4">
                {asset.previewUrl ? <img src={asset.previewUrl} alt={asset.name} className="h-20 w-20 rounded-lg object-cover" /> : <FileScan className="h-10 w-10 text-cyan-300" />}
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{asset.name}</h3>
                  <p className="text-xs text-slate-400">{asset.type} · {(asset.size / 1024).toFixed(1)} KB</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{asset.extractedText}</p>
                </div>
              </div>
            </Card>
          )) : (
            <Card className="grid min-h-96 place-items-center border-cyan-300/20 bg-slate-950/80 text-center text-white">
              <div>
                <FileScan className="mx-auto h-12 w-12 text-cyan-300" />
                <h2 className="mt-4 font-display text-2xl font-black">Scanned documents appear here</h2>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
