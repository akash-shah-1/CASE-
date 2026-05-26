import { VercelRequest, VercelResponse } from "@vercel/node";
import { generateDocx } from "../server/docx-generator";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;
    const buffer = await generateDocx(data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${data.title.replace(/\s+/g, "_")}_CaseStudy.docx`
    );
    res.send(buffer);
  } catch (error: any) {
    console.error("Download Error:", error);
    res.status(500).json({ error: error.message });
  }
}
