export function saturate(v: number): number {
  return Math.min(Math.max(v, 0.0), 1.0);
}
