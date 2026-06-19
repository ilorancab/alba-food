import { PlusCircle, Calendar, Utensils, AlertCircle, ClipboardList } from 'lucide-react';
import type { FeedingFormData } from '../types';

interface FeedingFormProps {
  formData: FeedingFormData;
  isDuplicating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
}

export default function FeedingForm({
  formData,
  isDuplicating,
  onSubmit,
  onChange,
  onCancel,
}: FeedingFormProps) {
  const isEditing = Boolean(formData.id);

  const getButtonLabel = () => {
    if (isEditing) return 'Actualizar Registro';
    if (isDuplicating) return 'Guardar Copia';
    return 'Guardar Registro';
  };

  const getButtonColor = () => {
    if (isEditing) return 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700';
    if (isDuplicating) return 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700';
    return 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700';
  };

  const showCancel = isEditing || isDuplicating;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-pink-100 dark:border-slate-700 transition-colors duration-200">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 mb-6 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <PlusCircle className="text-pink-500 dark:text-pink-400" />
          {isEditing ? 'Editar Toma' : isDuplicating ? 'Duplicar Toma' : 'Registrar Toma'}
        </span>
        {isDuplicating && (
          <span className="text-xs bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-medium animate-pulse">
            Modo Duplicar
          </span>
        )}
      </h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 flex items-center gap-1">
            <Calendar size={16} /> Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            placeholder="Cualquier detalle adicional..."
            className="w-full p-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 outline-none h-24 transition duration-200"
          />
        </div>
        <div className="md:col-span-2 mt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className={`flex-1 text-white font-bold py-3 rounded-xl transition duration-300 shadow-md flex items-center justify-center gap-2 ${getButtonColor()}`}
          >
            {getButtonLabel()}
          </button>
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 font-bold py-3 rounded-xl transition duration-300 shadow-sm flex items-center justify-center gap-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
