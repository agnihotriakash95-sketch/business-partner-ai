const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

async function askOpenAI(prompt: string): Promise<string> {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Business Partner AI. Help users in Hindi and English.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return data?.choices?.[0]?.message?.content || "No response";
  } catch (error) {
    console.error(error);
    return "AI Error";
  }
}

/* CHAT */

export async function sendBusinessChatMessage(
  messages: any,
  language?: string
): Promise<string> {
  let prompt = "";

  if (Array.isArray(messages)) {
    prompt = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");
  } else {
    prompt = String(messages);
  }

  return askOpenAI(`${language || "English"}\n${prompt}`);
}

/* ANALYZER */

export async function analyzeBusiness(
  data: any
): Promise<string> {
  return askOpenAI(JSON.stringify(data));
}

/* COLLECTION */

export async function generateCollectionMessage(
  customerName: string,
  amount: number
): Promise<string> {
  return askOpenAI(
    `Write payment reminder for ${customerName} for ₹${amount}`
  );
}

/* IMAGES */

export async function generateBusinessImages(
  prompt: string,
  type?: string
): Promise<any[]> {
  return [
    {
      id: crypto.randomUUID(),
      prompt,
      type: type || "business",
      createdAt: new Date().toISOString(),
      url: `https://placehold.co/600x400?text=${encodeURIComponent(
        prompt
      )}`,
    },
  ];
}

/* MSME */

export async function generateMsmeReport(
  data: any
): Promise<string> {
  return askOpenAI(JSON.stringify(data));
}

/* RECOVERY */

export async function generateRecoveryPlan(
  data: any
): Promise<string> {
  return askOpenAI(JSON.stringify(data));
}

/* REPORT */

export async function generateReport(
  title: string,
  data?: any
): Promise<string> {
  return askOpenAI(
    `${title}\n${JSON.stringify(data || {})}`
  );
}