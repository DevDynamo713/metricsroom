"use client";
import { useState, useEffect, useRef } from 'react';
export default function Room({ params }: { params: { id: string } }) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(`wss://metricsroom.devdynamo713.com/room/${params.id}/ws`);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'update') {
        setMetrics(prev => {
          const idx = prev.findIndex(m => m.id === data.data.id);
          if (idx >= 0) { const n = [...prev]; n[idx] = data.data; return n; }
          return [...prev, data.data];
        });
      }
    };
    wsRef.current = ws;
    const poll = setInterval(async () => {
      const res = await fetch(`https://metricsroom.devdynamo713.com/room/${params.id}/state`);
      if (res.ok) setMetrics(await res.json());
    }, 3000);
    return () => { ws.close(); clearInterval(poll); };
  }, [params.id]);
  const addMetric = async () => {
    const data = { id: Date.now().toString(), name: 'New Metric', value: Math.floor(Math.random() * 100), threshold: 80, status: 'ok' };
    await fetch(`https://metricsroom.devdynamo713.com/room/${params.id}/update`, { method: 'POST', body: JSON.stringify(data) });
  };
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', background: '#0a0a0a', color: '#e5e5e5', minHeight: '100vh' }}>
      <h1>MetricsRoom: {params.id}</h1>
      <button className="add-btn" onClick={addMetric} style={{ marginBottom: 16, padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Add Random Metric</button>
      <div className="metric-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {metrics.map(m => (
          <div key={m.id} style={{ padding: 16, border: '1px solid #27272a', borderRadius: 12, background: m.status === 'critical' ? '#450a0a' : m.status === 'warning' ? '#422006' : '#052e16' }}>
            <strong style={{ fontSize: 18 }}>{m.name}</strong>
            <div style={{ marginTop: 8, color: '#a1a1aa' }}>Value: {m.value} / Threshold: {m.threshold}</div>
            <div style={{ marginTop: 4, fontWeight: 'bold', color: m.status === 'critical' ? '#f87171' : m.status === 'warning' ? '#fbbf24' : '#4ade80' }}>{m.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}