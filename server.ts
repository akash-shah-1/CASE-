import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generateCaseStudyContent, generateImage } from "./server/gemini";
import { generateDocx } from "./server/docx-generator";
import puppeteer from "puppeteer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

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

  app.post("/api/generate-image", async (req, res) => {
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
  });

  app.post("/api/generate-images", async (req, res) => {
    try {
      const { images } = req.body;
      if (!images || !Array.isArray(images)) {
        return res.status(400).json({ error: "Images array is required" });
      }
      
      // Generate all images in parallel
      const imagePromises = images.map(async (img: any) => {
        try {
          const imageUrl = await generateImage(img.prompt);
          return { id: img.id, imageUrl, success: true };
        } catch (error) {
          console.error(`Failed to generate image ${img.id}:`, error);
          return { id: img.id, imageUrl: "", success: false };
        }
      });
      
      const results = await Promise.all(imagePromises);
      res.json({ images: results });
    } catch (error: any) {
      console.error("Batch Image Generation Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/export-pdf", async (req, res) => {
    try {
      const { html } = req.body;
      if (!html) return res.status(400).json({ error: "html is required" });

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

      // Set the full HTML directly — includes all inlined styles from the frontend
      await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      });

      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="CaseStudy.pdf"`);
      res.send(Buffer.from(pdfBuffer));
    } catch (error: any) {
      console.error("PDF Export Error:", error);
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
