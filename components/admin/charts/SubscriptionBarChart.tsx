"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SubscriptionData {
  план: string;
  потребители: number;
  mrr: number;
}

interface SubscriptionBarChartProps {
  data: SubscriptionData[];
}

export function SubscriptionBarChart({ data }: SubscriptionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="план"
          stroke="#a1a1aa"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#a1a1aa"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#fafafa'
          }}
          formatter={(value: number, name: string) => {
            if (name === 'mrr') {
              return [`€${value.toFixed(2)}`, 'MRR'];
            }
            return [value, 'Потребители'];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
          iconType="rect"
        />
        <Bar
          dataKey="потребители"
          fill="#3b82f6"
          name="Потребители"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="mrr"
          fill="#22c55e"
          name="MRR (€)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
