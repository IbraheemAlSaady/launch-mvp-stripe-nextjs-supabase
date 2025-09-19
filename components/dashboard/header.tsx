import { ReactElement } from 'react';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children
}: DashboardHeaderProps): ReactElement {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{heading}</h1>
        {text && <p className="text-base text-slate-600 dark:text-slate-400">{text}</p>}
      </div>
      {children}
    </div>
  );
}