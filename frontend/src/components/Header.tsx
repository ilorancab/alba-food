import { Baby, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  babyName: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ babyName, darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between gap-4 border-b border-pink-100 dark:border-slate-800 pb-6">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 flex items-center justify-center md:justify-start gap-2">
          <Baby size={40} className="text-pink-500 dark:text-pink-400" />{' '}
          Diario de Alimentación de {babyName}
        </h1>
        <p className="text-pink-400 dark:text-pink-300 mt-2 italic font-medium">
          🌟 ¡Cada cucharada es un logro, {babyName}! 🌟
        </p>
      </div>
      <button
        onClick={onToggleDarkMode}
        className="p-3 rounded-xl bg-white dark:bg-slate-800 text-pink-500 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-700 shadow-sm border border-pink-100 dark:border-slate-700 transition duration-200"
        title={darkMode ? 'Activar tema claro' : 'Activar tema oscuro'}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
