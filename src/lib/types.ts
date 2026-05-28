export type Language = "python" | "javascript" | "java" | "cpp";
export type Difficulty = "easy" | "medium" | "hard";
export type Pattern =
  | "arrays"
  | "hash-map"
  | "sliding-window"
  | "two-pointers"
  | "binary-search"
  | "trees"
  | "graphs"
  | "dfs-bfs"
  | "dynamic-programming"
  | "heap"
  | "stack"
  | "backtracking"
  | "union-find";

export type TokenType =
  | "keyword"
  | "builtin"
  | "string"
  | "number"
  | "operator"
  | "punctuation"
  | "identifier"
  | "function"
  | "comment"
  | "default";

export interface CharToken {
  char: string;
  type: TokenType;
}

export type CurriculumTier = "core-reflex" | "interview-fluency" | "advanced-fluency";

export type SyntaxMotif =
  | "hash-lookup"
  | "freq-counter"
  | "hash-set-membership"
  | "sliding-window-expand"
  | "sliding-window-contract"
  | "two-pointer-converge"
  | "two-pointer-chase"
  | "binary-search-mid"
  | "binary-search-boundary"
  | "binary-search-answer"
  | "dfs-recursion"
  | "bfs-queue"
  | "tree-recursion"
  | "heap-push-pop"
  | "monotonic-stack"
  | "stack-matching"
  | "dp-tabulation"
  | "dp-memoization"
  | "backtrack-choose-explore-unchoose"
  | "union-find-compress"
  | "graph-adjacency"
  | "topological-sort"
  | "prefix-sum"
  | "suffix-pass"
  | "deque-window"
  | "linked-list-pointer"
  | "interval-merge"
  | "greedy-local"
  | "counter-defaultdict"
  | "enumerate-index";

export type FluencyLevel = 1 | 2 | 3 | 4 | 5;

export interface Snippet {
  id: string;
  title: string;
  pattern: Pattern;
  difficulty: Difficulty;
  language: Language;
  code: string;
  description?: string;
  tier: CurriculumTier;
  fluencyLevel: FluencyLevel;
  motifs: SyntaxMotif[];
  prerequisites?: string[];
  variant?: string;
  leetcodeId?: number;
  /** Original inspiration — never copied verbatim from external catalogs. */
  provenance?: ContentProvenance;
  /** Parent snippet when this is an optimization or alternative implementation. */
  variantOf?: string;
  /** Content packs this snippet belongs to (e.g. blind-75-track). */
  packIds?: string[];
}

/** How a snippet relates to external inspiration — derived, not cloned. */
export interface ContentProvenance {
  inspiration: ContentSourceId;
  /** Always true for AlgoType-authored snippets derived from public patterns. */
  independentlyAuthored: true;
  externalId?: string;
  notes?: string;
}

export type ContentSourceId =
  | "algotype-original"
  | "neetcode-inspired"
  | "leetcode-pattern"
  | "hackerrank-progression"
  | "codeforces-elite"
  | "advent-of-code"
  | "project-euler"
  | "rosetta-code"
  | "github-community"
  | "community-pack";

export type ContentPackStatus = "active" | "planned" | "community" | "seasonal";

export interface ContentPack {
  id: string;
  name: string;
  description: string;
  status: ContentPackStatus;
  domains: string[];
  languages: Language[];
  motifFocus: SyntaxMotif[];
  targetSnippetCount?: number;
  inspiration?: ContentSourceId[];
}

export interface SnippetDraft {
  id: string;
  title: string;
  pattern: Pattern;
  difficulty: Difficulty;
  language: Language;
  code: string;
  tier: CurriculumTier;
  description?: string;
  fluencyLevel?: FluencyLevel;
  motifs?: SyntaxMotif[];
  prerequisites?: string[];
  variantOf?: string;
  packIds?: string[];
  leetcodeId?: number;
  provenance: ContentProvenance;
}

export interface CurriculumTierInfo {
  id: CurriculumTier;
  name: string;
  description: string;
  targetCount: number;
  color: string;
}

export interface SyntaxMotifInfo {
  id: SyntaxMotif;
  label: string;
  description: string;
  pattern: Pattern;
}

export interface PatternPack {
  id: Pattern;
  name: string;
  description: string;
  color: string;
}

export interface KeystrokeEvent {
  char: string;
  index: number;
  correct: boolean;
  timestamp: number;
  delayMs: number;
  wasBlank?: boolean;
  autoIndent?: boolean;
}

export type RecallMode = "full-copy" | "token-blank" | "line-blank" | "skeleton";

/** Top-level cognitive training modes. */
export type TrainingMode = "type" | "recall" | "review" | "sprint";

export interface RecallMetrics {
  recallAccuracy: number;
  blanksTotal: number;
  blanksCorrect: number;
  blanksIncorrect: number;
  reveals: number;
  corrections: number;
  avgBlankHesitationMs: number;
  weakTokens: string[];
  confidenceScore: number;
}

export interface SprintMetrics {
  interviewReadiness: number;
  implementationConfidence: number;
  hesitationDensity: number;
  correctionCount: number;
  gradeLabel: string;
  insights: string[];
}

export interface TypingResult {
  id: string;
  snippetId: string;
  pattern: Pattern;
  difficulty: Difficulty;
  language: Language;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  durationMs: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timestamp: number;
  keystrokes: KeystrokeEvent[];
  trainingMode?: TrainingMode;
  recallMode?: RecallMode;
  recallMetrics?: RecallMetrics;
  sprintMetrics?: SprintMetrics;
}

export interface DailyActivity {
  date: string;
  sessions: number;
  minutes: number;
  avgWpm: number;
  avgAccuracy: number;
  patterns: Pattern[];
}

export interface PatternStats {
  pattern: Pattern;
  sessions: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
  fluencyScore: number;
}

export interface UserStats {
  results: TypingResult[];
  dailyActivity: Record<string, DailyActivity>;
  streak: { current: number; longest: number; lastActive: string | null };
  totalMinutes: number;
  totalSessions: number;
}

export interface TypingSettings {
  patternPack: Pattern | "all";
  difficulty: Difficulty | "all";
  language: Language;
  curriculumTier: CurriculumTier | "all";
  adaptiveMode: boolean;
  trainingMode: TrainingMode;
  recallMode: RecallMode;
  testDurationSec: number;
  /** Company-specific implementation fluency profile. */
  companyTrack: CompanyTrackId;
  /** Levels.fyi-inspired procedural seniority ladder. */
  careerLevel: CareerLevelId;
}

/** Cognitive training profile — not "interview prep", implementation fluency. */
export type CompanyTrackId =
  | "general"
  | "meta"
  | "google"
  | "openai"
  | "anthropic"
  | "deepmind"
  | "jane-street";

export type CareerLevelId =
  | "foundation"
  | "junior"
  | "mid"
  | "senior"
  | "staff"
  | "research";

export type CompanyTrackStatus = "active" | "planned";

export interface SprintGradingProfile {
  targetWpm: number;
  minAccuracy: number;
  speedWeight: number;
  accuracyWeight: number;
  hesitationPenaltyFactor: number;
  readinessThresholds: { ready: number; strong: number; developing: number };
  gradeLabels: { ready: string; strong: string; developing: string };
}

export interface CoachingStyle {
  sprintEmphasis: string;
  weaknessFraming: string;
  strengthFraming: string;
  nextStepPrefix: string;
}

export interface CompanyTrack {
  id: CompanyTrackId;
  name: string;
  tagline: string;
  cognitiveProfile: string;
  marketingLabel: string;
  status: CompanyTrackStatus;
  languages: Language[];
  motifWeights: Partial<Record<SyntaxMotif, number>>;
  patternWeights: Partial<Record<Pattern, number>>;
  difficultyBias: Record<Difficulty, number>;
  modeWeights: Record<TrainingMode, number>;
  sprintProfile: SprintGradingProfile;
  coaching: CoachingStyle;
  packId?: string;
}

export interface CareerLevel {
  id: CareerLevelId;
  name: string;
  shortLabel: string;
  description: string;
  characteristics: string;
  fluencyLevelRange: [FluencyLevel, FluencyLevel];
  complexity: number;
  pressureMultiplier: number;
  preferredRecallMode: RecallMode;
  sprintThresholdAdjust: number;
  difficultyFilter: Difficulty[];
}

export interface CurriculumProfile {
  track: CompanyTrack;
  level: CareerLevel;
}

export interface TrackReadinessScore {
  score: number;
  label: string;
  motifCoverage: number;
  sprintSessions: number;
  avgSprintReadiness: number;
  weakMotifs: SyntaxMotif[];
}

export type CharState = "pending" | "correct" | "incorrect" | "extra";
