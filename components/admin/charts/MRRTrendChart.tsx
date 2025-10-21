"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MRRDataPoint {
  месец: string;
  mrr: number;
  aiРазходи: number;
  печалба: number;
}

interface MRRTrendChartProps {
  data: MRRDataPoint[];
}

export function MRRTrendChart({ data }: MRRTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="месец"
          stroke="#a1a1aa"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#a1a1aa"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `€${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#fafafa'
          }}
          formatter={(value: number) => [`€${value.toFixed(2)}`, '']}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="mrr"
          stroke="#3b82f6"
          strokeWidth={2}
          name="MRR (Месечни приходи)"
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="aiРазходи"
          stroke="#f97316"
          strokeWidth={2}
          name="AI Разходи"
          dot={{ fill: '#f97316', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="печалба"
          stroke="#22c55e"
          strokeWidth={2}
          name="Печалба"
          dot={{ fill: '#22c55e', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
