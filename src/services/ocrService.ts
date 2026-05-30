import type { UploadedAsset } from '../types';

export const extractTextFromFile = async (file: File): Promise<UploadedAsset> => {
  const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
  const text = file.type.includes('pdf')
    ? `PDF uploaded: ${file.name}. Demo OCR summary: invoice/project document detected. Connect OpenAI vision or Document AI in production for line-item extraction.`
    : file.type.startsWith('image/')
      ? `Image uploaded: ${file.name}. Demo OCR summary: possible bill/invoice with vendor name, date, amount, and tax fields.`
      : `Document uploaded: ${file.name}. Demo extraction summary generated.`;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    previewUrl,
    extractedText: text,
    createdAt: new Date().toISOString(),
  };
};
