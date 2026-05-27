export interface ImagePlaceholder {
  id: string;           // e.g., "page1_cover", "page2_problem1"
  prompt: string;       // AI-generated image prompt
  imageUrl?: string;    // Generated image URL (base64 or URL)
  position: string;     // e.g., "top", "center", "bottom"
  alt?: string;         // Alt text for accessibility
}

export interface CaseStudyData {
  title: string;
  introduction: {
    text: string;
    country: string;
    businessType: string;
  };
  businessGoal: string;
  problem: {
    overview: string;
    points: string[];
  };
  approach: {
    overview: string;
    discover: string;
    solve: string;
    simplify: string;
    sustain: string;
  };
  solution: {
    overview: string;
    points: string[];
    modes: string[];
  };
  technologyStack: string[];
  benefits: string[];
  projectFeatures: string[];
  resultsAchieved: string;
  images: ImagePlaceholder[];
}

export interface GenerationRequest {
  requirement: string;
}
