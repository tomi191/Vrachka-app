"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AICostData {
  име: string;
  разход: number;
  процент: number;
}

interface AICostsPieChartProps {
  data: AICostData[];
}

const COLORS = {
  'Таро четения': '#8b5cf6',
  'Врачката (Oracle)': '#ec4899',
  'Хороскопи': '#f59e0b',
  'Дневно съдържание': '#10b981',
};

export function AICostsPieChart({ data }: AICostsPieChartProps) {
  const chartData = data.map(item => ({
    name: item.име,
    value: item.разход,
    percent: item.процент
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name as keyof typeof COLORS] || '#64748b'}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#fafafa'
          }}
          formatter={(value: number) => `€${value.toFixed(2)}`}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
