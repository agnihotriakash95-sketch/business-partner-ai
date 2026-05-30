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
                "You are Business Partner AI. Help users in Hindi and English about business, startups, finance, loans, DPR, marketing and growth.",
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

export async function sendBusinessChatMessage(message: string) {
  return await askOpenAI(message);
}

/* =========================
   ANALYZER
========================= */

export async function analyzeBusiness(data: string) {
  return await askOpenAI(
    `Analyze this business professionally:\n\n${data}`
  );
}

/* =========================
   COLLECTION MESSAGE
========================= */

export async function generateCollectionMessage(name: string, amount: string) {
  return await askOpenAI(
    `Write a polite payment collection reminder for ${name} for pending amount ₹${amount}.`
  );
}

/* =========================
   IMAGE GENERATOR
========================= */

export async function generateBusinessImages(prompt: string) {
  return [
    {
      url: `https://placehold.co/600x400?text=${encodeURIComponent(prompt)}`,
    },
  ];
}

/* =========================
   MSME REPORT
========================= */

export async function generateMsmeReport(data: string) {
  return await askOpenAI(
    `Create a professional MSME business report:\n\n${data}`
  );
}

/* =========================
   RECOVERY PLAN
========================= */

export async function generateRecoveryPlan(data: string) {
  return await askOpenAI(
    `Create a business recovery plan:\n\n${data}`
  );
}

/* =========================
   REPORT GENERATOR
========================= */

export async function generateReport(data: string) {
  return await askOpenAI(
    `Generate a professional business report:\n\n${data}`
  );
}