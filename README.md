# Trust Graph Engine

Multi-dimensional trust scoring engine for people in your world. Models credibility across domains with evidence tracking, fuzzy person resolution, and hermeneutic re-evaluation — each new observation re-evaluates the whole picture.

> "Context tells you what's happening, but trust tells you what to do about it."

## What It Does

Trust Graph maintains a credibility model for every person in your system. Instead of a single "trust score," it tracks **six independent dimensions**:

| Dimension | What It Measures |
|-----------|------------------|
| **Reliability** | Do they follow through on promises? |
| **Information Quality** | Is their information usually accurate? |
| **Emotional Trust** | Are they safe to be vulnerable with? |
| **Timeliness** | Do they respond and deliver on time? |
| **Domain Expertise** | Per-domain competency ratings |
| **Overall** | Weighted composite of all dimensions |

Each dimension is backed by **evidence** — concrete observations that justify the score. Trust isn't a static number; it's a living model that evolves with every interaction.

## Key Concepts

### Hermeneutic Re-evaluation

Unlike simple rolling averages, Trust Graph implements a hermeneutic circle: after every N pieces of evidence (configurable), it re-evaluates **all** trust dimensions from **all** evidence. Recent evidence is weighted more heavily (exponential decay with 30-day half-life), but older evidence still contributes. This means a pattern of broken promises from 6 months ago still matters, just less than last week's.

### Fuzzy Person Resolution

When you mention "John," the engine resolves this to the right PersonNode through:

1. **Exact alias match** — "john@company.com" → exact hit
2. **Normalized name match** — "John Smith" = "john smith"
3. **Levenshtein fuzzy match** — "Jon Smith" → "John Smith" (distance ≤ 2)
4. **First-name uniqueness** — "John" → "John Smith" (if only one John exists)
5. **New node creation** — if no match found

New spellings are automatically added as aliases for future resolution.

### Time-Based Decay

Trust scores decay slowly toward a floor of 0.3 when someone hasn't been seen. This represents uncertainty ("we don't know anymore") rather than distrust. Active relationships maintain their scores.

## Installation

```bash
npm install trust-graph
```

## Quick Start

```typescript
import { TrustGraph } from 'trust-graph';

const graph = new TrustGraph();

// Initialize with a persistence file path
await graph.initialize('./trust-data.json');

// Resolve or create a person
const { person, isNew } = graph.resolvePerson('Alice Chen');
console.log(isNew ? 'New person created' : 'Existing person found');

// Add trust evidence
graph.addEvidence(person!.id, {
  type: 'accurate_info',
  description: 'Correctly predicted Q3 revenue within 5%',
  impact: 0.8,
  domain: 'finance',
});

graph.addEvidence(person!.id, {
  type: 'promise_kept',
  description: 'Delivered the design review on time',
  impact: 0.6,
});

// Query trust
const alice = graph.getPersonById(person!.id);
console.log(`Overall trust: ${(alice!.trust.overall * 100).toFixed(0)}%`);
console.log(`Reliability: ${(alice!.trust.reliability * 100).toFixed(0)}%`);

// Get a rich context string (for LLM prompt injection)
const context = graph.getContextForPerson(person!.id);
console.log(context);

// Get a compact summary of all key people (for system prompts)
const summary = graph.getPromptContext();
console.log(summary);
```

## In-Memory Mode

If you don't provide a file path, the graph runs entirely in memory:

```typescript
const graph = new TrustGraph();
await graph.initialize(); // No path = in-memory only
```

## API Reference

### `TrustGraph`

#### Initialization

- **`initialize(filePath?, config?)`** — Load from JSON file (or start empty). Optional config overrides.
- **`importData(data)`** — Load from a `TrustGraphStorage` object.
- **`exportData()`** — Export current state as `TrustGraphStorage`.
- **`flush()`** — Force save to disk (useful before process exit).

#### Person Resolution

- **`resolvePerson(identifier, type?)`** — Find or create a person. Returns `{ person, confidence, isNew }`.
- **`addAlias(personId, alias, type, confidence?)`** — Link a new alias to an existing person.

#### Trust Scoring

- **`addEvidence(personId, evidence)`** — Record a trust-relevant observation.
- **`recomputeTrust(personId)`** — Force full hermeneutic re-evaluation.

#### Communication

- **`logCommunication(personId, event)`** — Log an interaction with sentiment.
- **`processPersonMentions(mentions)`** — Batch-process person mentions from conversation.

#### Context Generation

- **`getContextForPerson(personId)`** — Rich markdown context for one person.
- **`getContextForPersons(personIds)`** — Multi-person context (for meetings).
- **`getPromptContext()`** — Compact summary of top ~15 people (for system prompts).

#### Queries

- **`findByDomain(domain)`** — Find people with expertise in a domain.
- **`getMostTrusted(limit?)`** — Top trusted people.
- **`getRecentInteractions(limit?)`** — Most recently seen people.
- **`getAllPersons()`** — All people, sorted by last seen.
- **`getPersonById(id)`** — Direct lookup.
- **`getPersonCount()`** — Total person count.

#### Person Management

- **`updateNotes(personId, notes)`** — Set free-text notes.
- **`linkPersons(personIdA, personIdB, label)`** — Create a bidirectional relationship.

## Evidence Types

| Type | Positive Impact | Negative Impact |
|------|----------------|-----------------|
| `promise_kept` | They delivered | — |
| `promise_broken` | — | They didn't deliver |
| `accurate_info` | Info was correct | — |
| `inaccurate_info` | — | Info was wrong |
| `helpful_action` | They helped | — |
| `unhelpful_action` | — | Not helpful |
| `emotional_support` | Supportive | Harmful |
| `user_stated` | User says trust | User says distrust |
| `observed` | Positive observation | Negative observation |
| `inferred` | Inferred positive | Inferred negative |

## Configuration

```typescript
interface TrustGraphConfig {
  maxPersons: number;        // Default: 200
  evidenceRetention: number; // Days to keep evidence (default: 90)
  decayRate: number;         // Trust decay per day of no interaction (default: 0.001)
  reEvalThreshold: number;   // Evidence count that triggers full re-eval (default: 5)
}
```

## Use Cases

- **AI Assistants** — Inject trust context into LLM system prompts so the AI knows whose advice to weight more heavily
- **Meeting Prep** — Generate trust-annotated attendee profiles before a meeting
- **Communication Drafts** — Shape tone and strategy based on recipient's trust profile
- **Source Credibility** — Annotate information with source reliability scores
- **Relationship Intelligence** — Track how trust evolves over time across your network

## Origin

Extracted from [Agent Friday](https://github.com/FutureSpeakAI/Agent-Friday), an AI desktop companion. Decoupled from Electron and made framework-agnostic for general use.

## License

MIT
