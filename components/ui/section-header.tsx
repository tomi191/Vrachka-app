import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  /**
   * Icon component from lucide-react
   */
  icon?: LucideIcon;

  /**
   * Badge text (e.g., "100% Безплатно", "Блог", "FAQ")
   */
  badge?: string;

  /**
   * Main heading text
   */
  heading: string | ReactNode;

  /**
   * Description text below heading
   */
  description?: string;

  /**
   * Custom icon color class (default: text-accent-400)
   */
  iconColor?: string;

  /**
   * Center align content (default: true)
   */
  centered?: boolean;
}

/**
 * SectionHeader Component
 * Reusable section header with optional badge, icon, heading, and description
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   icon={Star}
 *   badge="100% Безплатно"
 *   heading="Изберете вашата зодия"
 *   description="Дневни хороскопи за всички 12 зодиакални знака"
 * />
 * ```
 */
export function SectionHeader({
  icon: Icon,
  badge,
  heading,
  description,
  iconColor = 'text-accent-400',
  centered = true
}: SectionHeaderProps) {
  const alignClass = centered ? 'text-center' : '';
  const containerClass = centered ? 'items-center' : '';

  return (
    <div className={`mb-16 ${alignClass}`}>
      {/* Badge */}
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm ${iconColor} mb-4`}>
          {Icon && <Icon className="w-4 h-4" />}
          <span>{badge}</span>
        </div>
      )}

      {/* Heading */}
      <h2 className="text-4xl font-bold text-zinc-50 mb-4">
        {heading}
      </h2>

      {/* Description */}
      {description && (
        <p className={`text-xl text-zinc-400 ${centered ? 'max-w-3xl mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
}
