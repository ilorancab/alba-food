import { Filter } from 'lucide-react';
import type { Week } from '../types';

interface WeekSelectorProps {
  weeks: Week[];
  selectedWeek: string;
  onChange: (week: string) => void;
}

export default function WeekSelector({ weeks, selectedWeek, onChange }: WeekSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter size={18} className="text-pink-400 dark:text-pink-300" />
      <select
        value={selectedWeek}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none text-sm bg-pink-50 dark:bg-slate-700 text-pink-700 dark:text-pink-300 font-medium transition duration-200"
      >
        <option value="all">Todas las semanas</option>
        {weeks.map((w) => (
          <option key={w.start} value={w.start}>
            {w.label}
          </option>
        ))}
      </select>
    </div>
  );
}
