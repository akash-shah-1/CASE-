import { VercelRequest, VercelResponse } from "@vercel/node";
import { generateCaseStudyContent } from "../server/gemini";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { requirement } = req.body;
    if (!requirement) {
      return res.status(400).json({ error: "Requirement is required" });
    }
    const data = await generateCaseStudyContent(requirement);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
}
