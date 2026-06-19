import { ClipboardList } from 'lucide-react';
import type { FeedingEntry, SortConfig } from '../types';
import WeekSelector from './WeekSelector';
import type { Week } from '../types';

interface FeedingTableProps {
  feedings: FeedingEntry[];
  loading: boolean;
  sortConfig: SortConfig;
  weeks: Week[];
  selectedWeek: string;
  onSort: (key: keyof FeedingEntry) => void;
  onWeekChange: (week: string) => void;
  onEdit: (entry: FeedingEntry) => void;
  onDuplicate: (entry: FeedingEntry) => void;
  onDelete: (id: number) => void;
}

function SortIcon({ column, sortConfig }: { column: keyof FeedingEntry; sortConfig: SortConfig }) {
  if (sortConfig.key !== column) return null;
  return sortConfig.direction === 'asc' ? (
    <span className="inline-block">▲</span>
  ) : (
    <span className="inline-block">▼</span>
  );
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function FeedingTable({
  feedings,
  loading,
  sortConfig,
  weeks,
  selectedWeek,
  onSort,
  onWeekChange,
  onEdit,
  onDuplicate,
  onDelete,
}: FeedingTableProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border-2 border-pink-100 dark:border-slate-700 transition-colors duration-200">
      <div className="p-6 border-b border-pink-50 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 flex items-center gap-2">
          <ClipboardList className="text-pink-500 dark:text-pink-400" /> Historial
        </h2>
        <WeekSelector weeks={weeks} selectedWeek={selectedWeek} onChange={onWeekChange} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-pink-50 dark:bg-slate-700/50 text-pink-700 dark:text-pink-300 transition-colors duration-200">
              <th
                className="p-4 font-bold border-b dark:border-slate-700 cursor-pointer hover:bg-pink-100 dark:hover:bg-slate-700 transition select-none"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center gap-1">
                  Día/Fecha <SortIcon column="date" sortConfig={sortConfig} />
                </div>
              </th>
              <th
                className="p-4 font-bold border-b dark:border-slate-700 cursor-pointer hover:bg-pink-100 dark:hover:bg-slate-700 transition select-none"
                onClick={() => onSort('food')}
              >
                <div className="flex items-center gap-1">
                  Alimentación <SortIcon column="food" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="p-4 font-bold border-b dark:border-slate-700">Cantidad</th>
              <th className="p-4 font-bold border-b dark:border-slate-700">Reacción</th>
              <th className="p-4 font-bold border-b dark:border-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800">
                  Cargando...
                </td>
              </tr>
            ) : feedings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-800">
                  No hay registros para este periodo.
                </td>
              </tr>
            ) : (
              feedings.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-pink-50/50 dark:hover:bg-slate-700/30 transition border-b dark:border-slate-700 last:border-0 bg-white dark:bg-slate-800"
                >
                  <td className="p-4">
                    <div className="font-semibold capitalize text-gray-800 dark:text-slate-200">
                      {(() => {
                        const w = parseLocalDate(entry.date).toLocaleDateString('es-ES', { weekday: 'long' });
                        return w.charAt(0).toUpperCase() + w.slice(1);
                      })()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-slate-400">{entry.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800 dark:text-slate-200">{entry.food}</div>
                    {entry.observations && (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 italic font-light max-w-xs break-words">
                        Obs: {entry.observations}
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-gray-800 dark:text-slate-300">{entry.quantity}</td>
                  <td className="p-4">
                    {entry.reaction && (
                      <span className="bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-full text-xs font-medium border border-pink-200/50 dark:border-pink-900/30">
                        {entry.reaction}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2 md:gap-3 whitespace-nowrap">
                      <button
                        onClick={() => onEdit(entry)}
                        className="text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium text-sm transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDuplicate(entry)}
                        className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm transition"
                      >
                        Duplicar
                      </button>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
