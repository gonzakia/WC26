import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
};

export function SectionCard({ title, eyebrow, children }: SectionCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-glow backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-ink">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}
