const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function askAI(message: string) {
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
                "You are Business Partner AI. You help users in Hindi and English for business, startup, finance, marketing, loans, DPR and growth.",
            },

            {
              role: "user",
              content: message,
            },
          ],

          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);

    return "AI error occurred";
  }
}