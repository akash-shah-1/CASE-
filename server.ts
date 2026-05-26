import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generateCaseStudyContent } from "./server/gemini";
import { generateDocx } from "./server/docx-generator";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/generate", async (req, res) => {
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
  });

  app.post("/api/download", async (req, res) => {
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
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
