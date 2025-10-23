'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";

interface FinancialData {
  period: string;
  revenue: {
    total: number;
    basic: { mrr: number; count: number };
    ultimate: { mrr: number; count: number };
  };
  costs: {
    ai: number;
    supabase: number;
    vercel: number;
    other: number;
  };
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
}

interface FinancialReportsClientProps {
  data: FinancialData;
}

export function FinancialReportsClient({ data }: FinancialReportsClientProps) {
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Export to CSV
  const exportToCSV = () => {
    setExportingCSV(true);

    try {
      const csvData = [
        ['Vrachka - Финансов отчет'],
        ['Период:', data.period],
        [''],
        ['ПРИХОДИ (REVENUE)'],
        ['Категория', 'Стойност (EUR)', 'Брой потребители'],
        ['Basic план', data.revenue.basic.mrr.toFixed(2), data.revenue.basic.count.toString()],
        ['Ultimate план', data.revenue.ultimate.mrr.toFixed(2), data.revenue.ultimate.count.toString()],
        ['ОБЩО ПРИХОДИ', data.revenue.total.toFixed(2), ''],
        [''],
        ['РАЗХОДИ (COSTS)'],
        ['Категория', 'Стойност (EUR)'],
        ['AI разходи (OpenRouter)', data.costs.ai.toFixed(2)],
        ['Supabase', data.costs.supabase.toFixed(2)],
        ['Vercel Hosting', data.costs.vercel.toFixed(2)],
        ['Други разходи', data.costs.other.toFixed(2)],
        ['ОБЩО РАЗХОДИ', data.totalCosts.toFixed(2)],
        [''],
        ['ПЕЧАЛБА (PROFIT)'],
        ['Метрика', 'Стойност'],
        ['Gross Profit', `${data.grossProfit >= 0 ? '+' : ''}${data.grossProfit.toFixed(2)} EUR`],
        ['Profit Margin', `${data.profitMargin.toFixed(1)}%`],
        [''],
        ['ИЗЧИСЛЕНИЕ'],
        ['Приходи - Разходи = Печалба'],
        [`€${data.revenue.total.toFixed(2)} - €${data.totalCosts.toFixed(2)} = €${data.grossProfit.toFixed(2)}`],
      ];

      const csv = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `vrachka-financial-report-${data.period.toLowerCase().replace(/\s+/g, '-')}.csv`;
      link.click();
    } finally {
      setExportingCSV(false);
    }
  };

  // Export to PDF (using browser print)
  const exportToPDF = () => {
    setExportingPDF(true);

    try {
      // Create printable HTML
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Моля, разрешете pop-ups за експорт на PDF');
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Финансов отчет - ${data.period}</title>
            <style>
              @page {
                size: A4;
                margin: 20mm;
              }

              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: Arial, sans-serif;
                color: #1f2937;
                line-height: 1.6;
              }

              .header {
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }

              .header h1 {
                color: #1f2937;
                font-size: 28px;
                margin-bottom: 5px;
              }

              .header .period {
                color: #6b7280;
                font-size: 14px;
              }

              .section {
                margin-bottom: 30px;
                page-break-inside: avoid;
              }

              .section-title {
                background: #f3f4f6;
                padding: 10px 15px;
                font-size: 16px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 15px;
                border-left: 4px solid #3b82f6;
              }

              .item {
                display: flex;
                justify-content: space-between;
                padding: 12px 15px;
                border-bottom: 1px solid #e5e7eb;
              }

              .item:last-child {
                border-bottom: none;
              }

              .item.total {
                background: #f9fafb;
                font-weight: bold;
                font-size: 18px;
                border-top: 2px solid #d1d5db;
                border-bottom: 2px solid #d1d5db;
              }

              .item.profit {
                background: ${data.grossProfit >= 0 ? '#dcfce7' : '#fee2e2'};
                font-weight: bold;
                font-size: 20px;
                color: ${data.grossProfit >= 0 ? '#166534' : '#991b1b'};
                border: 2px solid ${data.grossProfit >= 0 ? '#22c55e' : '#ef4444'};
              }

              .label {
                color: #4b5563;
              }

              .value {
                font-weight: 600;
                color: #1f2937;
              }

              .value.positive {
                color: #059669;
              }

              .value.negative {
                color: #dc2626;
              }

              .subitem {
                padding: 8px 15px 8px 35px;
                font-size: 14px;
                color: #6b7280;
              }

              .calculation {
                background: #eff6ff;
                padding: 15px;
                margin-top: 20px;
                border-radius: 8px;
                border: 1px solid #93c5fd;
              }

              .calculation-text {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: #1e40af;
                text-align: center;
              }

              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #9ca3af;
                font-size: 12px;
              }

              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Финансов отчет - Vrachka</h1>
              <div class="period">Период: ${data.period}</div>
            </div>

            <!-- Revenue Section -->
            <div class="section">
              <div class="section-title">💰 ПРИХОДИ (REVENUE)</div>
              <div class="subitem">
                <div>Basic план (€5.00/месец) × ${data.revenue.basic.count} потребители</div>
                <div style="margin-top: 5px; color: #1f2937; font-weight: 600;">€${data.revenue.basic.mrr.toFixed(2)}</div>
              </div>
              <div class="subitem">
                <div>Ultimate план (€10.00/месец) × ${data.revenue.ultimate.count} потребители</div>
                <div style="margin-top: 5px; color: #1f2937; font-weight: 600;">€${data.revenue.ultimate.mrr.toFixed(2)}</div>
              </div>
              <div class="item total">
                <span class="label">ОБЩО ПРИХОДИ</span>
                <span class="value positive">€${data.revenue.total.toFixed(2)}</span>
              </div>
            </div>

            <!-- Costs Section -->
            <div class="section">
              <div class="section-title">💸 РАЗХОДИ (COSTS)</div>
              <div class="item">
                <span class="label">AI разходи (OpenRouter)</span>
                <span class="value">€${data.costs.ai.toFixed(2)}</span>
              </div>
              <div class="item">
                <span class="label">Supabase</span>
                <span class="value">€${data.costs.supabase.toFixed(2)}</span>
              </div>
              <div class="item">
                <span class="label">Vercel Hosting</span>
                <span class="value">€${data.costs.vercel.toFixed(2)}</span>
              </div>
              <div class="item">
                <span class="label">Други разходи</span>
                <span class="value">€${data.costs.other.toFixed(2)}</span>
              </div>
              <div class="item total">
                <span class="label">ОБЩО РАЗХОДИ</span>
                <span class="value negative">€${data.totalCosts.toFixed(2)}</span>
              </div>
            </div>

            <!-- Profit Section -->
            <div class="section">
              <div class="section-title">✅ ПЕЧАЛБА (GROSS PROFIT)</div>
              <div class="item profit">
                <span class="label">Печалба за месеца</span>
                <span class="value ${data.grossProfit >= 0 ? 'positive' : 'negative'}">
                  ${data.grossProfit >= 0 ? '+' : ''}€${data.grossProfit.toFixed(2)}
                </span>
              </div>
              <div class="item">
                <span class="label">Profit Margin</span>
                <span class="value">${data.profitMargin.toFixed(1)}%</span>
              </div>

              <div class="calculation">
                <div class="calculation-text">
                  €${data.revenue.total.toFixed(2)} (приходи) - €${data.totalCosts.toFixed(2)} (разходи) = ${data.grossProfit >= 0 ? '+' : ''}€${data.grossProfit.toFixed(2)} (печалба)
                </div>
              </div>
            </div>

            <div class="footer">
              Генериран от Vrachka Admin Panel • ${new Date().toLocaleString('bg-BG')}
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => printWindow.close();
        }, 250);
      };
    } finally {
      setTimeout(() => setExportingPDF(false), 1000);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="glass-card border-zinc-800 hover:border-zinc-700"
        onClick={exportToCSV}
        disabled={exportingCSV}
      >
        {exportingCSV ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        Export CSV
      </Button>
      <Button
        variant="outline"
        className="glass-card border-zinc-800 hover:border-zinc-700"
        onClick={exportToPDF}
        disabled={exportingPDF}
      >
        {exportingPDF ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <FileText className="w-4 h-4 mr-2" />
        )}
        Export PDF
      </Button>
    </div>
  );
}
