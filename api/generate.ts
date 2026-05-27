import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (error.status === 503 || error.status === 429 || (error.message && error.message.includes("503"))) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Gemini API busy (503/429). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

async function generateCaseStudyContent(requirement: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      introduction: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          country: { type: Type.STRING },
          businessType: { type: Type.STRING },
        },
        required: ["text", "country", "businessType"]
      },
      businessGoal: { type: Type.STRING },
      problem: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          points: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["overview", "points"]
      },
      approach: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          discover: { type: Type.STRING },
          solve: { type: Type.STRING },
          simplify: { type: Type.STRING },
          sustain: { type: Type.STRING },
        },
        required: ["overview", "discover", "solve", "simplify", "sustain"]
      },
      solution: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          points: { type: Type.ARRAY, items: { type: Type.STRING } },
          modes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["overview", "points", "modes"]
      },
      technologyStack: { type: Type.ARRAY, items: { type: Type.STRING } },
      benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
      projectFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
      resultsAchieved: { type: Type.STRING },
      images: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            prompt: { type: Type.STRING },
            position: { type: Type.STRING },
            alt: { type: Type.STRING },
          },
          required: ["id", "prompt", "position", "alt"]
        }
      },
    },
    required: [
      "title", "introduction", "businessGoal", "problem", "approach", 
      "solution", "technologyStack", "benefits", "projectFeatures", "resultsAchieved", "images"
    ]
  };

  const prompt = `
    You are a professional case study writer for a software development company called CIS.
    Based on the following client requirement, generate a structured case study content.
    Follow the "POS System" case study structure from the reference (Introduction, Business Goal, Problem, CIS Approach, Solution, Technology Stack, Benefits, Project Features, Results Achieved).
    
    Requirement: "${requirement}"
    
    Guidelines:
    - Use professional, business-oriented language.
    - Title should be catchy and highlight the system (e.g., "AI-Powered CRM System", "Smart Logistics Dashboard").
    - "Introduction" text should be 2-3 sentences.
    - "Business Goal" should be a high-level strategic aim.
    - "Problem" Overview should describe the challenges, and points should list specific technical or business issues.
    - "Approach" must follow the 4 S's: Discover, Solve, Simplify, Sustain. Describe what each means for THIS specific project.
    - "Solution" Overview should describe the results, points should list features or integrated devices, and modes should be typical usage contexts (like "Web", "Mobile", "Offline").
    - "Technology Stack" should be a list of 4-6 modern technologies.
    - "Benefits" should be 8-12 concise bullet points.
    - "Project Features" should be 4-6 key technical features.
    - "Results Achieved" should be a summarizing paragraph about growth and success.
    - "images" must be an array of EXACTLY 7 objects with these fixed IDs in this order:
        1. id: "page1_cover"   — a wide hero banner image representing the overall project/industry
        2. id: "page2_problem1" — an image visualizing the legacy system challenges
        3. id: "page2_problem2" — an image showing technical bottlenecks or pain points
        4. id: "page3_solution1" — an image of the modern solution architecture or UI
        5. id: "page3_solution2" — an image showing cloud/infrastructure or deployment
        6. id: "page4_benefits"  — an image representing business results and ROI
        7. id: "page4_results"   — an image showing successful implementation or happy users
      For each image, write a detailed, vivid "prompt" (2-3 sentences) for an AI image generator that is specific to THIS project's industry and context. Set "position" to "center" for all. Set "alt" to a short descriptive label.
  `;

  const response = await withRetry(() => ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema as any,
    },
  }));

  if (!response.text) {
    throw new Error("Failed to generate content from Gemini");
  }

  return JSON.parse(response.text);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
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
    const { requirement } = req.body;
    if (!requirement) {
      return res.status(400).json({ error: "Requirement is required" });
    }
    const data = await generateCaseStudyContent(requirement);
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
}
