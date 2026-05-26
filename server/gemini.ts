import { GoogleGenAI, Type } from "@google/genai";
import { CaseStudyData } from "../src/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

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
    },
    required: [
      "title", "introduction", "businessGoal", "problem", "approach", 
      "solution", "technologyStack", "benefits", "projectFeatures", "resultsAchieved"
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
  `;

  const response = await withRetry(() => ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema as any,
    },
  }));

  if (!response.text) {
    throw new Error("Failed to generate content from Gemini");
  }

  return JSON.parse(response.text) as CaseStudyData;
}
