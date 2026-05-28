export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance = values.reduce((a, v) => a + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function linearTrend(values: number[]): number {
  if (values.length < 2) return 0;
  return values[values.length - 1] - values[0];
}

export function confidenceLabelFromScore(score: number): import("./types").ConfidenceLabel {
  if (score >= 85) return "likely-mastered";
  if (score >= 65) return "high-confidence";
  if (score >= 40) return "needs-reinforcement";
  return "needs-reinforcement";
}
