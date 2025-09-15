import { chatCompletion } from "@huggingface/inference";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  try {
    if (!process.env.HF_ACCESS_TOKEN) {
      return res.status(500).json({ error: "HF_ACCESS_TOKEN not configured" });
    }

    const ingredients = (req.body?.ingredients || []).join(", ");
    const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients... format in markdown.`;

    const response = await chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      accessToken: process.env.HF_ACCESS_TOKEN,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients}. Suggest a recipe!` },
      ],
      max_tokens: 1024,
    });

    const msg = response.choices?.[0]?.message;
    let recipe = "";
    if (typeof msg?.content === "string") recipe = msg.content;
    else if (Array.isArray(msg?.content)) recipe = msg.content.map(c => c.text ?? "").join("");

    res.status(200).json({ recipe });
  } catch (err) {
    console.error("API error:", err?.message ?? err);
    res.status(500).json({ error: "Internal server error" });
  }
}
