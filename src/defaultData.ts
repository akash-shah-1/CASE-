import { CaseStudyData } from './types';

export const defaultCaseStudy: CaseStudyData = {
  title: "OmniChannel Pharmacy POS & Inventory Suite",
  introduction: {
    text: "This document profiles the architectural overhaul and system migration completed by CIS for a major compounding and retail pharmacy chain operating 120+ regional outlets. The mission-critical deployment addresses real-time dispensing control and direct ERP synchronization.",
    country: "United Kingdom",
    businessType: "Enterprise Retail Healthcare"
  },
  businessGoal: "To establish a resilient, secure, and unified point-of-sale platform that integrates pharmacists' dispensing workflows with automated e-commerce inventory sync, maintaining 100% operational uptime.",
  problem: {
    overview: "The client's legacy retail systems suffered from fatal stock disparities during peak hours, slow card terminal responses, database locks during offline events, and lacked an integrated safety check gate for prescription fulfillment.",
    points: [
      "Frequent database lockups due to concurrent inventory updates from Web & POS channels",
      "Total checkout paralyzer during internet outages at remote clinic locations",
      "High compliance risk on controlled substance dispensing and medical barcode scanning",
      "Average checkout latency exceeding 45 seconds per transactions"
    ]
  },
  approach: {
    overview: "CIS deployed its proprietary four-stage documentation and execution blueprint to systematic design, develop, and deliver the system with zero operational downtime.",
    discover: "Audited existing API endpoints, analyzed pharmacy inventory bottlenecks, and mapped barcode scanning safety standard specifications.",
    solve: "Engineered a dual-layered local synchronization cluster with offline-first PouchDB instances and secure, encrypted background queues.",
    simplify: "Designed an automated, super-fast keyboard-first cash-out drawer UI optimizing barcode scan events to a single-keystroke action.",
    sustain: "Delivered auto-updating medical drug-interaction warning feeds and configured automated telemetry to trigger alert logs upon sensor disconnects."
  },
  solution: {
    overview: "A comprehensive point-of-sale and live distribution ledger. The system operates on native Android terminals and high-speed web browsers, pairing automatic local inventory holds with cloud-based master records.",
    points: [
      "Direct hardware bridge for barcode scan guns, weight scales, and card readers",
      "Local backup databases allowing up to 48 hours of uninterrupted offline transaction capabilities",
      "Real-time pharmaceutical drug-interaction database lookup integrated directly at item scan"
    ],
    modes: ["Web App", "Android Client", "Offline Caching Database Cluster", "Master ERP API Sync"]
  },
  technologyStack: ["React", "TypeScript", "Node.js", "PouchDB", "Redis", "SQLite", "Tailwind CSS", "Docker"],
  benefits: [
    "99.99% system availability during critical local network outages",
    "Checkout latency slashed from 45 seconds to just under 4 seconds",
    "100% Elimination of prescription dispensing audit anomalies",
    "Real-time e-commerce catalog sync preventing redundant online orders of out-of-stock medicine",
    "Unified staff access control with drug dispensing privileges verification",
    "Automated reporting on controlled prescription substances directly matching regulatory standards"
  ],
  projectFeatures: [
    "Keyboard-First Fast Checkout",
    "Offline Transaction Ledgering",
    "Live Inventory Sync Queues",
    "Dispensary Gate Warning Alerts",
    "Dynamic Batch & Expiry Tracker"
  ],
  resultsAchieved: "The POS suite is successfully running on 350+ active terminals across all 120+ stores. The pharmacy chain saw a 28% increase in operational throughput, zero stock discrepancies, and full compliance approval on controlled drugs within the first quarter of rollout."
};
