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
}

export interface GenerationRequest {
  requirement: string;
}
