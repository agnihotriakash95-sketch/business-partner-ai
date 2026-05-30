const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

async function askOpenAI(prompt: string) {
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
                "You are Business Partner AI. Help users professionally in Hindi and English for business, startups, finance, loans, DPR, marketing and growth.",
            },

            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    return data.choices?.[0]?.message?.content || "No response";
  } catch (error) {
    console.error(error);

    return "AI error occurred";
  }
}

/* =========================
   CHAT
========================= */

export async function sendBusinessChatMessage(
  message: string,
  language?: string
) {
  return await askOpenAI(
    `${language || "English"}:\n${message}`
  );
}

/* =========================
   ANALYZER
========================= */

export async function analyzeBusiness(data: any) {
  return await askOpenAI(
    `Analyze this business professionally:\n${JSON.stringify(data, null, 2)}`
  );
}

/* =========================
   COLLECTIONS
========================= */

export async function generateCollectionMessage(
  customerName: string,
  amount: number
) {
  return await askOpenAI(
    `Write a professional payment reminder for ${customerName} for pending payment of ₹${amount}.`
  );
}

/* =========================
   IMAGE GENERATOR
========================= */

export async function generateBusinessImages(
  prompt: string,
  type?: string
) {
  return [
    {
      id: crypto.randomUUID(),
      prompt,
      type: type || "logo",
      createdAt: new Date().toISOString(),
      url: `https://placehold.co/600x400/png?text=${encodeURIComponent(prompt)}`,
    },
  ];
}

/* =========================
   MSME REPORT
========================= */

export async function generateMsmeReport(data: any) {
  return await askOpenAI(
    `Create a professional MSME business report:\n${JSON.stringify(data, null, 2)}`
  );
}

/* =========================
   RECOVERY PLAN
========================= */

export async function generateRecoveryPlan(data: any) {
  return await askOpenAI(
    `Create a professional business recovery plan:\n${JSON.stringify(data, null, 2)}`
  );
}

/* =========================
   REPORT GENERATOR
========================= */

export async function generateReport(
  title: string,
  data?: any
) {
  return await askOpenAI(
    `Generate a professional report for:\nTitle: ${title}\n\n${JSON.stringify(
      data,
      null,
      2
    )}`
  );
}