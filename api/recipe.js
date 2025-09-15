import { chatCompletion } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });

  const { ingredients } = req.body;
  if (!Array.isArray(ingredients)) return res.status(400).json({ error: "ingredients must be an array" });

  try {
    const response = await chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      accessToken: process.env.HF_ACCESS_TOKEN,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients.join(", ")}. Suggest a recipe!` },
      ],
      max_tokens: 1024,
    });

    // defensively extract the text
    const raw = response.choices?.[0]?.message;
    let recipe = "";
    if (typeof raw?.content === "string") recipe = raw.content;
    else if (Array.isArray(raw?.content)) recipe = raw.content.map(c => c.text ?? "").join("");
    else recipe = JSON.stringify(raw ?? response);

    res.status(200).json({ recipe });
  } catch (err) {
    console.error("HF error:", err);
    res.status(500).json({ error: err.message || "Inference error" });
  }
}
