export interface FeedingEntry {
  id: number;
  date: string;
  food: string;
  quantity: string;
  reaction: string;
  observations: string;
}

export interface FeedingFormData {
  id?: number;
  date: string;
  food: string;
  quantity: string;
  reaction: string;
  observations: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof FeedingEntry;
  direction: SortDirection;
}

export interface Week {
  start: string;
  label: string;
}

export type FoodCategory = 'VEGETABLE' | 'FRUIT' | 'MEAT' | 'FISH' | 'LEGUME' | 'DAIRY' | 'CEREAL' | 'OTHER';

export interface FoodTried {
  name: string;
  category: FoodCategory | null;
  lastDate: string;
  totalTimes: number;
}
