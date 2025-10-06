import type { ComponentType } from 'react';

type CardStatProps = {
  icon: ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
};

export function CardStat({ icon: Icon, value, label }: CardStatProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3 text-slate-500">
        <Icon className="h-5 w-5" aria-hidden />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{value}</div>
    </div>
  );
}

