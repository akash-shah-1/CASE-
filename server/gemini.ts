import { GoogleGenAI, Type } from "@google/genai";
import type { CaseStudyData } from "../src/types";
import * as dotenv from "dotenv";

// Load .env before anything else
dotenv.config();

// Lazy-initialize so the API key is read after dotenv runs
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment");
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // 503 Service Unavailable or 429 Too Many Requests
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

export async function generateCaseStudyContent(requirement: string): Promise<CaseStudyData> {
  const imageIds = [
    "page1_cover",
    "page2_problem1",
    "page2_problem2",
    "page3_solution1",
    "page3_solution2",
    "page4_benefits",
    "page4_results"
  ];

  const imageAlts = [
    "Project Cover Image",
    "Problem Visualization 1",
    "Problem Visualization 2",
    "Solution Implementation 1",
    "Solution Implementation 2",
    "Benefits Visualization",
    "Results Achieved"
  ];

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
      }
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
    
    IMPORTANT - IMAGE GENERATION:
    You MUST generate exactly 7 image prompts for this case study. Each prompt should be a detailed, professional description suitable for AI image generation (like DALL-E, Midjourney, or Imagen).
    
    Image placement guidelines:
    - page1_cover: Introduction/cover image - show the business context or environment
    - page2_problem1: First problem/challenge visualization
    - page2_problem2: Second problem/challenge visualization
    - page3_solution1: First solution/implementation visualization
    - page3_solution2: Second solution/implementation visualization
    - page4_benefits: Benefits/success metrics visualization
    - page4_results: Final results/outcome visualization
    
    Each prompt should:
    - Be 15-25 words describing a professional, realistic scene
    - Include context about the industry/business type
    - Avoid text in images (use descriptions like "professional team", "modern technology", "corporate setting")
    - Use descriptive language suitable for AI image generation
    - Be relevant to the specific case study content (e.g., pharmacy for healthcare, warehouse for logistics)
    
    Example image prompt: "Modern retail pharmacy store interior with digital checkout terminals, professional staff, organized medication shelves, clean corporate environment"
  `;

  const response = await withRetry(() => getAI().models.generateContent({
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

  const result = JSON.parse(response.text) as CaseStudyData;
  
  // Ensure we have exactly 7 image prompts with proper IDs
  if (!result.images || result.images.length === 0) {
    result.images = imageIds.map((id, idx) => ({
      id,
      prompt: `Professional business visualization for ${result.title || 'case study'}`,
      position: "center",
      alt: imageAlts[idx]
    }));
  }
  
  // Ensure all 7 image slots exist with proper IDs
  while (result.images.length < 7) {
    const idx = result.images.length;
    result.images.push({
      id: imageIds[idx],
      prompt: `Business visualization for ${result.title || 'case study'}`,
      position: "center",
      alt: imageAlts[idx] || `Image ${idx + 1}`
    });
  }
  
  // Trim to exactly 7
  result.images = result.images.slice(0, 7).map((img, idx) => ({
    ...img,
    id: imageIds[idx],
    alt: imageAlts[idx] || img.alt,
    position: "center"
  }));

  return result;
}

export async function generateImage(imagePrompt: string): Promise<string> {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken || hfToken === "your_huggingface_token_here") {
    console.error("HF_TOKEN not set in .env");
    return "";
  }

  // FLUX.1-schnell — free, fast, high quality
  const HF_MODEL = "black-forest-labs/FLUX.1-schnell";
  const url = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

  try {
    console.log(`[HF] Generating image for prompt: "${imagePrompt.slice(0, 80)}..."`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json",
        "Accept": "image/jpeg",
      },
      body: JSON.stringify({
        inputs: imagePrompt,
        parameters: {
          num_inference_steps: 4,
          width: 896,
          height: 512,
          seed: Math.floor(Math.random() * 2147483647), // random seed = different image every call
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[HF] API error ${response.status}:`, errText);
      return "";
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log(`[HF] Image generated successfully, size: ${arrayBuffer.byteLength} bytes`);
    return `data:${contentType};base64,${base64}`;

  } catch (error: any) {
    console.error("[HF] generateImage failed:", error.message);
    return "";
  }
}
