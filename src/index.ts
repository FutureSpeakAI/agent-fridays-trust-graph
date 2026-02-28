/**
 * Trust Graph Engine — Multi-dimensional trust scoring for people in your world.
 *
 * Models every person with multi-dimensional trust scoring, evidence tracking,
 * person resolution (fuzzy alias matching), and hermeneutic re-evaluation —
 * each new observation re-evaluates the whole picture.
 *
 * Core concept: "Context tells you what's happening, but trust tells you what
 * to do about it." This is a credibility graph — how much should you weight
 * a person's input across different domains?
 *
 * @module trust-graph
 * @license MIT
 */

export { TrustGraph } from './trust-graph';
export type {
  PersonNode,
  PersonAlias,
  TrustScores,
  DomainScore,
  TrustEvidence,
  EvidenceType,
  CommEvent,
  SentimentPoint,
  PersonMention,
  ResolutionResult,
  TrustGraphConfig,
} from './types';
