import { describe, it, expect } from 'vitest';
import { evaluateMetric, formatMetric } from './metrics';
describe('metrics', () => {
  it('evaluates ok', () => { expect(evaluateMetric(50, 100)).toBe('ok'); });
  it('evaluates warning', () => { expect(evaluateMetric(100, 100)).toBe('warning'); });
  it('evaluates critical', () => { expect(evaluateMetric(150, 100)).toBe('critical'); });
  it('formats correctly', () => { expect(formatMetric({ id: '1', name: 'CPU', value: 50, threshold: 100, status: 'ok' })).toBe('CPU: 50 (ok)'); });
});
