/**
 * Trust Graph Engine — Type definitions.
 */

export interface PersonNode {
  id: string;
  primaryName: string;
  aliases: PersonAlias[];
  trust: TrustScores;
  evidence: TrustEvidence[];
  communicationLog: CommEvent[];
  sentiment: SentimentPoint[];
  domains: string[];
  relationships: { personId: string; label: string }[];
  notes: string;
  firstSeen: number;
  lastSeen: number;
  interactionCount: number;
}

export interface PersonAlias {
  value: string;
  type: 'name' | 'email' | 'handle' | 'phone' | 'nickname';
  confidence: number;
}

export interface TrustScores {
  overall: number;
  reliability: number;
  expertise: DomainScore[];
  emotionalTrust: number;
  timeliness: number;
  informationQuality: number;
  /** Runtime-extensible trust dimensions. */
  extended?: Record<string, number>;
}

export interface DomainScore {
  domain: string;
  score: number;
  basis: string;
}

export type EvidenceType =
  | 'promise_kept'
  | 'promise_broken'
  | 'accurate_info'
  | 'inaccurate_info'
  | 'helpful_action'
  | 'unhelpful_action'
  | 'emotional_support'
  | 'user_stated'
  | 'observed'
  | 'inferred';

export interface TrustEvidence {
  id: string;
  timestamp: number;
  type: EvidenceType;
  description: string;
  impact: number; // -1 to +1
  domain?: string;
}

export interface CommEvent {
  timestamp: number;
  channel: string;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  summary: string;
  sentiment: number;
}

export interface SentimentPoint {
  timestamp: number;
  score: number;
  context: string;
}

export interface PersonMention {
  name: string;
  context: string;
  sentiment: number;
  domains?: string[];
  evidenceType?: EvidenceType;
}

export interface ResolutionResult {
  person: PersonNode | null;
  confidence: number;
  isNew: boolean;
}

export interface TrustGraphConfig {
  maxPersons: number;           // Default 200
  evidenceRetention: number;    // Days to keep evidence, default 90
  decayRate: number;            // Trust decay per day of no interaction, default 0.001
  reEvalThreshold: number;      // Evidence count that triggers hermeneutic re-eval, default 5
}

export interface TrustGraphStorage {
  persons: PersonNode[];
  config: TrustGraphConfig;
}
