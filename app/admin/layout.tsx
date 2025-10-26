import Link from "next/link";
import { LayoutDashboard, Users, Crown, FileText, Settings, DollarSign, Sparkles } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-950">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-950/50">
        <nav className="flex flex-col w-full p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold gradient-text px-3">
              Vrachka Admin
            </h2>
            <p className="text-xs text-zinc-500 px-3 mt-1">Управление</p>
          </div>

          <NavLink
            href="/admin/dashboard"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
          />
          <NavLink
            href="/admin/blog"
            icon={<Sparkles className="w-5 h-5" />}
            label="Blog"
          />
          <NavLink
            href="/admin/financial"
            icon={<DollarSign className="w-5 h-5" />}
            label="Финанси"
          />
          <NavLink
            href="/admin/users"
            icon={<Users className="w-5 h-5" />}
            label="Потребители"
          />
          <NavLink
            href="/admin/subscriptions"
            icon={<Crown className="w-5 h-5" />}
            label="Абонаменти"
          />
          <NavLink
            href="/admin/content"
            icon={<FileText className="w-5 h-5" />}
            label="Съдържание"
          />
          <NavLink
            href="/admin/settings"
            icon={<Settings className="w-5 h-5" />}
            label="Настройки"
          />

          <div className="pt-6 mt-auto">
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              ← Към приложението
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 z-50">
        <div className="flex items-center justify-around p-2">
          <MobileNavLink
            href="/admin/dashboard"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
          />
          <MobileNavLink
            href="/admin/blog"
            icon={<Sparkles className="w-5 h-5" />}
            label="Blog"
          />
          <MobileNavLink
            href="/admin/financial"
            icon={<DollarSign className="w-5 h-5" />}
            label="Финанси"
          />
          <MobileNavLink
            href="/admin/users"
            icon={<Users className="w-5 h-5" />}
            label="Users"
          />
        </div>
      </nav>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-colors"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function MobileNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-400 hover:text-zinc-100 transition-colors"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}
