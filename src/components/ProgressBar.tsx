"use client";

interface Props {
  current: number; // 1-based
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-txt-muted">
          კითხვა {current} / {total}
        </span>
        <span className="text-xs font-semibold text-accent">{percent}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border-dark overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
