import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FeedingEntry, FeedingFormData, SortConfig, Week } from './types';
import { fetchFeedings, fetchConfig, createFeeding, updateFeeding, deleteFeeding } from './api';
import Header from './components/Header';
import FeedingForm from './components/FeedingForm';
import FeedingTable from './components/FeedingTable';
import FoodCatalog from './components/FoodCatalog';

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getMonday(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayOfWeek = d.getDay();
  const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(year, month - 1, diff);
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const dayVal = String(monday.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayVal}`;
}

const emptyForm: FeedingFormData = {
  date: new Date().toISOString().split('T')[0],
  food: '',
  quantity: '',
  reaction: '',
  observations: '',
};

export default function App() {
  const [tab, setTab] = useState<'registry' | 'foods'>('registry');
  const [feedings, setFeedings] = useState<FeedingEntry[]>([]);
  const [formData, setFormData] = useState<FeedingFormData>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [babyName, setBabyName] = useState('Alba');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const init = async () => {
      try {
        const config = await fetchConfig();
        setBabyName(config.babyName);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
      try {
        const data = await fetchFeedings();
        setFeedings(data);
        if (data.length > 0) {
          const mondays = [...new Set(data.map((f) => getMonday(f.date)))].sort();
          setSelectedWeek(mondays[mondays.length - 1]);
        }
      } catch (error) {
        console.error('Error fetching feedings:', error);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    document.title = `Diario de Alimentación de ${babyName}`;
  }, [babyName]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const weeks: Week[] = useMemo(() => {
    const weekMap = new Map<string, Week>();
    feedings.forEach((f) => {
      const monday = getMonday(f.date);
      if (!weekMap.has(monday)) {
        const mondayDate = parseLocalDate(monday);
        weekMap.set(monday, {
          start: monday,
          label: `Semana del ${mondayDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`,
        });
      }
    });
    return Array.from(weekMap.values()).sort((a, b) => b.start.localeCompare(a.start));
  }, [feedings]);

  const filteredFeedings = useMemo(() => {
    if (selectedWeek === 'all') return feedings;
    return feedings.filter((f) => getMonday(f.date) === selectedWeek);
  }, [feedings, selectedWeek]);

  const sortedFeedings = useMemo(() => {
    return [...filteredFeedings].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredFeedings, sortConfig]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (formData.id) {
          await updateFeeding(formData.id, formData);
        } else {
          await createFeeding(formData);
        }
        const data = await fetchFeedings();
        setFeedings(data);
        setIsDuplicating(false);
        setFormData(emptyForm);
      } catch (error) {
        console.error('Error saving feeding:', error);
      }
    },
    [formData],
  );

  const editEntry = useCallback((entry: FeedingEntry) => {
    setIsDuplicating(false);
    setFormData(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const duplicateEntry = useCallback((entry: FeedingEntry) => {
    setIsDuplicating(true);
    setFormData({
      date: entry.date,
      food: entry.food,
      quantity: entry.quantity,
      reaction: entry.reaction,
      observations: entry.observations,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const deleteEntry = useCallback(async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await deleteFeeding(id);
        const data = await fetchFeedings();
        setFeedings(data);
      } catch (error) {
        console.error('Error deleting feeding:', error);
      }
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsDuplicating(false);
    setFormData(emptyForm);
  }, []);

  const handleSort = useCallback((key: keyof FeedingEntry) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-slate-900 text-gray-800 dark:text-slate-100 p-4 md:p-8 transition-colors duration-200">
      <Header babyName={babyName} darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />

      <main className="max-w-4xl mx-auto space-y-8">
        <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-2xl p-1 border-2 border-pink-100 dark:border-slate-700 shadow-lg">
          <button
            onClick={() => setTab('registry')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition duration-200 ${
              tab === 'registry'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-pink-500 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-700'
            }`}
          >
            📋 Registro de Tomas
          </button>
          <button
            onClick={() => setTab('foods')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition duration-200 ${
              tab === 'foods'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-pink-500 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-700'
            }`}
          >
            🥗 Alimentos Probados
          </button>
        </div>

        {tab === 'registry' ? (
          <>
            <FeedingForm
              formData={formData}
              isDuplicating={isDuplicating}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
              onCancel={handleCancelEdit}
            />

            <FeedingTable
              feedings={sortedFeedings}
              loading={loading}
              sortConfig={sortConfig}
              weeks={weeks}
              selectedWeek={selectedWeek}
              onSort={handleSort}
              onWeekChange={setSelectedWeek}
              onEdit={editEntry}
              onDuplicate={duplicateEntry}
              onDelete={deleteEntry}
            />
          </>
        ) : (
          <FoodCatalog />
        )}
      </main>

      <footer className="mt-12 text-center text-pink-300 dark:text-slate-500 text-sm">
        &copy; 2026 Diario de Alimentación de {babyName}
      </footer>
    </div>
  );
}
