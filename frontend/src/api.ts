import axios from 'axios';
import type { FeedingEntry, FeedingFormData, FoodTried } from './types';

const API_BASE_URL = '/api/feedings';

export async function fetchFeedings(): Promise<FeedingEntry[]> {
  const response = await axios.get<FeedingEntry[]>(API_BASE_URL);
  return response.data;
}

export async function fetchConfig(): Promise<{ babyName: string }> {
  const response = await axios.get<{ babyName: string }>('/api/config');
  return response.data;
}

export async function createFeeding(entry: FeedingFormData): Promise<FeedingEntry> {
  const { id: _unused, ...body } = entry;
  void _unused;
  const response = await axios.post<FeedingEntry>(API_BASE_URL, body);
  return response.data;
}

export async function updateFeeding(entryId: number, entry: FeedingFormData): Promise<FeedingEntry> {
  const { id: _unused, ...body } = entry;
  void _unused;
  const response = await axios.put<FeedingEntry>(`${API_BASE_URL}/${entryId}`, body);
  return response.data;
}

export async function deleteFeeding(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/${id}`);
}

export async function fetchFoodsTried(): Promise<FoodTried[]> {
  const response = await axios.get<FoodTried[]>('/api/foods/tried');
  return response.data;
}
