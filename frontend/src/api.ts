import axios from 'axios';
import type { FeedingEntry, FeedingFormData } from './types';

const API_BASE_URL = '/api/feedings';

export async function fetchFeedings(): Promise<FeedingEntry[]> {
  const response = await axios.get<FeedingEntry[]>(API_BASE_URL);
  return response.data;
}

export async function fetchConfig(): Promise<{ babyName: string }> {
  const response = await axios.get<{ babyName: string }>('/api/config');
  return response.data;
}

export async function saveFeeding(entry: FeedingFormData): Promise<FeedingEntry> {
  const response = await axios.post<FeedingEntry>(API_BASE_URL, entry);
  return response.data;
}

export async function deleteFeeding(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/${id}`);
}
