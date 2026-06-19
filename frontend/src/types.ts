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
