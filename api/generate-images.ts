import { VercelRequest, VercelResponse } from "@vercel/node";
import { generateImage } from "../server/gemini.js";

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
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: "Images array is required" });
    }

    const results = await Promise.all(
      images.map(async (img: any) => {
        try {
          const imageUrl = await generateImage(img.prompt);
          return { id: img.id, imageUrl, success: true };
        } catch (error) {
          console.error(`Failed to generate image ${img.id}:`, error);
          return { id: img.id, imageUrl: "", success: false };
        }
      })
    );

    res.json({ images: results });
  } catch (error: any) {
    console.error("Batch Image Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
}
