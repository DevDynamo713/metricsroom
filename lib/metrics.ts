export interface Metric { id: string; name: string; value: number; threshold: number; status: 'ok' | 'warning' | 'critical' }
export function evaluateMetric(value: number, threshold: number): 'ok' | 'warning' | 'critical' {
  if (value >= threshold * 1.2) return 'critical';
  if (value >= threshold) return 'warning';
  return 'ok';
}
export function formatMetric(m: Metric): string { return `${m.name}: ${m.value} (${m.status})`; }
