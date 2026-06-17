import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Utensils, Calendar, AlertCircle, ClipboardList, PlusCircle, Baby, ChevronUp, ChevronDown, Filter, Sun, Moon } from 'lucide-react';

const API_BASE_URL = '/api/feedings';

function App() {
  const [feedings, setFeedings] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    food: '',
    quantity: '',
    reaction: '',
    observations: ''
  });
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedWeek, setSelectedWeek] = useState('latest');
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [babyName, setBabyName] = useState('Alba');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    fetchConfig();
    fetchFeedings();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get('/api/config');
      if (response.data && response.data.babyName) {
        setBabyName(response.data.babyName);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

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

  const fetchFeedings = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setFeedings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedings:', error);
      setLoading(false);
    }
  };

  // Helper to parse date without timezone shift
  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to get Monday of a date in a timezone-safe manner
  const getMonday = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(year, month - 1, diff);
    
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const dayVal = String(monday.getDate()).padStart(2, '0');
    return `${y}-${m}-${dayVal}`;
  };

  // Group weeks for the selector
  const weeks = useMemo(() => {
    const weekMap = {};
    feedings.forEach(f => {
      const monday = getMonday(f.date);
      if (!weekMap[monday]) {
        const mondayDate = parseLocalDate(monday);
        weekMap[monday] = {
          start: monday,
          label: `Semana del ${mondayDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`
        };
      }
    });
    return Object.values(weekMap).sort((a, b) => b.start.localeCompare(a.start));
  }, [feedings]);

  // Handle week selection logic
  useEffect(() => {
    if (selectedWeek === 'latest' && weeks.length > 0) {
      setSelectedWeek(weeks[0].start);
    }
  }, [weeks, selectedWeek]);

  const filteredFeedings = useMemo(() => {
    if (selectedWeek === 'all') return feedings;
    if (selectedWeek === 'latest' && weeks.length > 0) {
      return feedings.filter(f => getMonday(f.date) === weeks[0].start);
    }
    return feedings.filter(f => getMonday(f.date) === selectedWeek);
  }, [feedings, selectedWeek, weeks]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFeedings = useMemo(() => {
    return [...filteredFeedings].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredFeedings, sortConfig]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE_URL, formData);
      fetchFeedings();
      setIsDuplicating(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        food: '',
        quantity: '',
        reaction: '',
        observations: ''
      });
    } catch (error) {
      console.error('Error saving feeding:', error);
    }
  };

  const editEntry = (entry) => {
    setIsDuplicating(false);
    setFormData(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const duplicateEntry = (entry) => {
    setIsDuplicating(true);
    setFormData({
      date: entry.date,
      food: entry.food,
      quantity: entry.quantity,
      reaction: entry.reaction,
      observations: entry.observations
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEntry = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchFeedings();
      } catch (error) {
        console.error('Error deleting feeding:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsDuplicating(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      food: '',
      quantity: '',
      reaction: '',
      observations: ''
    });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-slate-900 text-gray-800 dark:text-slate-100 p-4 md:p-8 transition-colors duration-200">
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between gap-4 border-b border-pink-100 dark:border-slate-800 pb-6">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 flex items-center justify-center md:justify-start gap-2">
            <Baby size={40} className="text-pink-500 dark:text-pink-400" /> Diario de Alimentación de {babyName}
          </h1>
          <p className="text-pink-400 dark:text-pink-300 mt-2 italic font-medium">🌟 ¡Cada cucharada es un logro, {babyName}! 🌟</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-xl bg-white dark:bg-slate-800 text-pink-500 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-700 shadow-sm border border-pink-100 dark:border-slate-700 transition duration-200"
          title={darkMode ? "Activar tema claro" : "Activar tema oscuro"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Form Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-pink-100 dark:border-slate-700 transition-colors duration-200">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 mb-6 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <PlusCircle className="text-pink-500 dark:text-pink-400" /> 
              {formData.id ? 'Editar Toma' : isDuplicating ? 'Duplicar Toma' : 'Registrar Toma'}
            </span>
            {isDuplicating && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-medium animate-pulse">
                Modo Duplicar
              </span>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 flex items-center gap-1">
                <Calendar size={16} /> Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 flex items-center gap-1">
                <Utensils size={16} /> Alimentación
              </label>
              <input
                type="text"
                name="food"
                value={formData.food}
                onChange={handleInputChange}
                placeholder="Ej: Puré de brócoli"
                className="w-full p-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none transition duration-200"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400">🥄 Cantidad/Tomas</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Ej: 150ml o 1/2 cuenco"
                className="w-full p-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none transition duration-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 flex items-center gap-1">
                <AlertCircle size={16} /> Reacción
              </label>
              <input
                type="text"
                name="reaction"
                value={formData.reaction}
                onChange={handleInputChange}
                placeholder="Ej: Le gustó mucho"
                className="w-full p-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none transition duration-200"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 flex items-center gap-1">
                <ClipboardList size={16} /> Observaciones
              </label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Cualquier detalle adicional..."
                className="w-full p-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none h-24 transition duration-200"
              ></textarea>
            </div>
            <div className="md:col-span-2 mt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className={`flex-1 text-white font-bold py-3 rounded-xl transition duration-300 shadow-md flex items-center justify-center gap-2 ${
                  formData.id 
                    ? 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700' 
                    : isDuplicating 
                      ? 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700' 
                      : 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700'
                }`}
              >
                {formData.id ? 'Actualizar Registro' : isDuplicating ? 'Guardar Copia' : 'Guardar Registro'}
              </button>
              {(formData.id || isDuplicating) && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 font-bold py-3 rounded-xl transition duration-300 shadow-sm flex items-center justify-center gap-2"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* List Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border-2 border-pink-100 dark:border-slate-700 transition-colors duration-200">
          <div className="p-6 border-b border-pink-50 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 flex items-center gap-2">
              <ClipboardList className="text-pink-500 dark:text-pink-400" /> Historial
            </h2>
            
            {/* Week Selector */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-pink-400 dark:text-pink-300" />
              <select 
                value={selectedWeek} 
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="p-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none text-sm bg-pink-50 dark:bg-slate-700 text-pink-700 dark:text-pink-300 font-medium transition duration-200"
              >
                <option value="all">Todas las semanas</option>
                {weeks.map(w => (
                  <option key={w.start} value={w.start}>{w.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50 dark:bg-slate-700/50 text-pink-700 dark:text-pink-300 transition-colors duration-200">
                  <th 
                    className="p-4 font-bold border-b dark:border-slate-700 cursor-pointer hover:bg-pink-100 dark:hover:bg-slate-700 transition select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Día/Fecha <SortIcon column="date" />
                    </div>
                  </th>
                  <th 
                    className="p-4 font-bold border-b dark:border-slate-700 cursor-pointer hover:bg-pink-100 dark:hover:bg-slate-700 transition select-none"
                    onClick={() => handleSort('food')}
                  >
                    <div className="flex items-center gap-1">
                      Alimentación <SortIcon column="food" />
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
                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800">Cargando...</td>
                  </tr>
                ) : sortedFeedings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-800">No hay registros para este periodo.</td>
                  </tr>
                ) : (
                  sortedFeedings.map((entry) => (
                    <tr key={entry.id} className="hover:bg-pink-50/50 dark:hover:bg-slate-700/30 transition border-b dark:border-slate-700 last:border-0 bg-white dark:bg-slate-800">
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
                            onClick={() => editEntry(entry)}
                            className="text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium text-sm transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => duplicateEntry(entry)}
                            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm transition"
                          >
                            Duplicar
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
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
      </main>

      <footer className="mt-12 text-center text-pink-300 dark:text-slate-500 text-sm">
        &copy; 2026 Diario de Alimentación de {babyName}
      </footer>
    </div>
  );
}

export default App;
