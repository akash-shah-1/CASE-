import { VercelRequest, VercelResponse } from "@vercel/node";
import { generateImage } from "../server/gemini";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required" });
    }

    const imageUrl = await generateImage(prompt);
    res.json({ imageUrl });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
}
