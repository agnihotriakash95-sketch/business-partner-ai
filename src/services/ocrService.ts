import type { UploadedAsset } from '../types';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const extractTextFromFile = async (file: File): Promise<UploadedAsset> => {
  const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

  if (!openaiApiKey) {
    throw new Error('VITE_OPENAI_API_KEY is required for document OCR and extraction.');
  }

  if (file.type.startsWith('image/')) {
    const base64 = await fileToBase64(file);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all business-relevant text from this document: vendor, date, amounts, line items, tax, invoice numbers. Format as structured plain text for business records.',
              },
              {
                type: 'image_url',
                image_url: { url: `data:${file.type};base64,${base64}` },
              },
            ],
          },
        ],
        max_tokens: 800,
      }),
    });

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };

    if (!response.ok) throw new Error(data.error?.message || 'OCR extraction failed');

    return {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl,
      extractedText: data.choices?.[0]?.message?.content || '',
      createdAt: new Date().toISOString(),
    };
  }

  const text = await file.text().catch(() => '');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Analyze this business document (${file.name}) and extract key financial and operational data:\n\n${text.slice(0, 12000)}`,
        },
      ],
      max_tokens: 800,
    }),
  });

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  if (!response.ok) throw new Error(data.error?.message || 'Document analysis failed');

  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    previewUrl,
    extractedText: data.choices?.[0]?.message?.content || '',
    createdAt: new Date().toISOString(),
  };
};
