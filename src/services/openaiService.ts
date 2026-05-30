export async function sendBusinessChatMessage(
  message: any,
  language?: string
) {

  let finalMessage = "";

  /* If array messages are coming */
  if (Array.isArray(message)) {

    finalMessage = message
      .map((m: any) => {
        return `${m.role}: ${m.content}`;
      })
      .join("\n");

  } else {

    finalMessage = String(message);

  }

  return await askOpenAI(
    `${language || "English"}:\n${finalMessage}`
  );
}