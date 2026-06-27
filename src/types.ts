import { SalesRecord, InventoryRecord, LeadRecord, ReviewRecord } from "./data/defaults";

export interface HealthScores {
  sales: number;
  marketing: number;
  operations: number;
  finance: number;
  customer: number;
  risk: number;
  overall: number;
}

export interface DirectorAnalysis {
  director: string;
  findings: string;
  recommendation: string;
  executiveSummary?: string;
  observations?: string[];
  keyProblems?: string[];
  opportunities?: string[];
  recommendedActions?: string[];
  businessRisk?: string;
  confidenceScore?: number;
}

export interface DirectorAnalyses {
  sales: DirectorAnalysis;
  marketing: DirectorAnalysis;
  operations: DirectorAnalysis;
  finance: DirectorAnalysis;
  customer: DirectorAnalysis;
  risk: DirectorAnalysis;
}

export interface DebateTurn {
  speaker: string;
  avatar: string;
  role: 'CEO' | 'Sales' | 'Marketing' | 'Operations' | 'Finance' | 'Customer Satisfaction' | 'Risk';
  text: string;
}

export interface ActionItem {
  title: string;
  timeline: string; // "Week 1", "Week 2", "Month 1", "Month 2", "Quarter"
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  roi: string;
  difficulty: 'High' | 'Medium' | 'Low';
  risk: 'High' | 'Medium' | 'Low';
  kpi: string;
  whyReasoning?: string;
  impactAnalysis?: string;
  confidence?: number;
  riskLevel?: 'High' | 'Medium' | 'Low';
}

export interface DirectorVote {
  director: string;
  role: string;
  vote: 'Approve' | 'Reject' | 'Approve with Concern';
  reason: string;
  avatar: string;
}

export interface DetailedHealthScores {
  sales: number;
  marketing: number;
  operations: number;
  finance: number;
  customer: number;
  risk: number;
  overall: number;
}

export interface MeetingMinutes {
  title: string;
  date: string;
  attendees: string[];
  summary: string;
  keyFindings: string;
  conflictsResolved: string;
  actionItems: string;
  futureRecommendations: string;
}

export interface MeetingSession {
  id: string;
  timestamp: string;
  stats: {
    revenue: number;
    orders: number;
    aov: number;
    profit: number;
    profitMarginPercent: number;
    inventoryCount: number;
    inventoryHealth: number;
    outOfStock: number;
    lowStock: number;
    pipeline: number;
    leadConversion: number;
    wonLeads: number;
    totalLeads: number;
    customerRating: number;
    sentimentStats: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  healthScores: HealthScores;
  preMeetingHealth?: DetailedHealthScores;
  postMeetingHealth?: DetailedHealthScores;
  analyses: DirectorAnalyses;
  debate: DebateTurn[];
  ceoDecision: {
    compromiseExplanation: string;
    finalDirective: string;
  };
  actionPlan: ActionItem[];
  votes?: DirectorVote[];
  meetingMinutes: MeetingMinutes;
  warning?: string;
}

export interface WhatIfFactors {
  revenueFactor: number;
  inventoryFactor: number;
  marketingBudgetFactor: number;
  customerSatisfactionFactor: number;
}

export interface DirectorProfile {
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
}
export type { SalesRecord, InventoryRecord, LeadRecord, ReviewRecord };
