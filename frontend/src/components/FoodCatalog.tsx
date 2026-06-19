import { useEffect, useState } from 'react';
import { fetchFoodsTried } from '../api';
import type { FoodTried } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  VEGETABLE: 'Verduras',
  FRUIT: 'Frutas',
  MEAT: 'Carnes',
  FISH: 'Pescados',
  LEGUME: 'Legumbres',
  DAIRY: 'Lácteos',
  CEREAL: 'Cereales',
  OTHER: 'Otros',
};

const CATEGORY_ICONS: Record<string, string> = {
  VEGETABLE: '🥦',
  FRUIT: '🍎',
  MEAT: '🥩',
  FISH: '🐟',
  LEGUME: '🫘',
  DAIRY: '🥛',
  CEREAL: '🌾',
  OTHER: '📦',
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  });
}

export default function FoodCatalog() {
  const [foods, setFoods] = useState<FoodTried[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodsTried()
      .then(setFoods)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = new Map<string, FoodTried[]>();
  const uncategorized: FoodTried[] = [];

  foods.forEach((f) => {
    if (f.category) {
      const key = f.category;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(f);
    } else {
      uncategorized.push(f);
    }
  });

  const categoryKeys = ['VEGETABLE', 'FRUIT', 'MEAT', 'FISH', 'LEGUME', 'DAIRY', 'CEREAL', 'OTHER'] as const;

  const totalCategories = categoryKeys.filter((k) => grouped.has(k)).length + (uncategorized.length > 0 ? 1 : 0);

  if (loading) {
    return (
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-pink-100 dark:border-slate-700">
        <p className="text-center text-gray-500 dark:text-slate-400">Cargando...</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-pink-100 dark:border-slate-700 transition-colors duration-200">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 mb-2 flex items-center gap-2">
        🥗 Alimentos Probados
      </h2>
      <p className="text-sm text-pink-400 dark:text-pink-300 mb-6">
        {foods.length} alimentos · {totalCategories} categorías
      </p>

      <div className="space-y-6">
        {categoryKeys.map((key) => {
          const items = grouped.get(key);
          if (!items) return null;
          return (
            <div key={key}>
              <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                {CATEGORY_ICONS[key]} {CATEGORY_LABELS[key]}
                <span className="text-sm font-normal text-gray-400 dark:text-slate-500">({items.length})</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-pink-50 dark:bg-slate-700/50 rounded-xl p-3 border border-pink-100 dark:border-slate-600 transition hover:shadow-sm"
                  >
                    <div className="font-semibold text-gray-800 dark:text-slate-200 capitalize truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Última vez: {formatDate(item.lastDate)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      {item.totalTimes} {item.totalTimes === 1 ? 'vez' : 'veces'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {uncategorized.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-500 dark:text-slate-400 mb-2 flex items-center gap-2">
              ❓ Sin categorizar ({uncategorized.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {uncategorized.map((item) => (
                <div
                  key={item.name}
                  className="bg-gray-100 dark:bg-slate-700/30 rounded-xl p-3 border border-gray-200 dark:border-slate-600"
                >
                  <div className="font-semibold text-gray-600 dark:text-slate-300 capitalize truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                    Última vez: {formatDate(item.lastDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
