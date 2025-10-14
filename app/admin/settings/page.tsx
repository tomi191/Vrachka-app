import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ArrowLeft, Database, Key, Mail, Zap } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="text-zinc-400 hover:text-zinc-300 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад към Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-zinc-50">Настройки</h1>
          <p className="text-zinc-400">Конфигурация на системата</p>
        </div>

        {/* Environment Variables */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Key className="w-5 h-5 text-accent-400" />
              API Keys & Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingItem
              label="Supabase URL"
              value={process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"}
              masked
            />
            <SettingItem
              label="Supabase Anon Key"
              value={
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? "Configured ✓"
                  : "Not configured"
              }
              masked
            />
            <SettingItem
              label="OpenAI API Key"
              value={
                process.env.OPENAI_API_KEY ? "Configured ✓" : "Not configured"
              }
              masked
            />
            <SettingItem
              label="Stripe Secret Key"
              value={
                process.env.STRIPE_SECRET_KEY
                  ? "Configured ✓"
                  : "Not configured"
              }
              masked
            />
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Database Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <TableStatus name="profiles" />
              <TableStatus name="subscriptions" />
              <TableStatus name="daily_content" />
              <TableStatus name="tarot_cards" />
              <TableStatus name="tarot_readings" />
              <TableStatus name="oracle_conversations" />
              <TableStatus name="content_cache" />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-400" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingItem
              label="Email Provider"
              value="Supabase Auth (Built-in)"
            />
            <SettingItem label="From Email" value="noreply@vrachka.com" />
            <SettingItem label="Email Templates" value="Configured via Supabase" />
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingItem label="Next.js Version" value="15.0.3" />
            <SettingItem label="React Version" value="19.0.0" />
            <SettingItem label="Node Environment" value={process.env.NODE_ENV || "development"} />
            <SettingItem
              label="Deployment"
              value={process.env.VERCEL ? "Vercel" : "Local"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingItem({
  label,
  value,
  masked = false,
}: {
  label: string;
  value: string;
  masked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
      <span className="text-sm text-zinc-400">{label}</span>
      <span
        className={`text-sm font-medium ${
          value.includes("Not configured")
            ? "text-red-400"
            : value.includes("✓")
            ? "text-green-400"
            : "text-zinc-200"
        }`}
      >
        {masked && value.length > 20 ? `${value.substring(0, 20)}...` : value}
      </span>
    </div>
  );
}

function TableStatus({ name }: { name: string }) {
  return (
    <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-300">{name}</span>
        <span className="w-2 h-2 rounded-full bg-green-400"></span>
      </div>
    </div>
  );
}
