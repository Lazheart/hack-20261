import { apiClient } from '../lib/api-client';
import type { Business, Report } from '../types';

export const businessService = {
  create: async (data: Business): Promise<Report> => {
    return apiClient('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getAll: async (): Promise<Business[]> => {
    return apiClient('/businesses', {
      method: 'GET',
    });
  },
  getOne: async (id: string): Promise<Business> => {
    return apiClient(`/businesses/${id}`, {
      method: 'GET',
    });
  },
  update: async (id: string, data: Partial<Business>): Promise<Business> => {
    return apiClient(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id: string): Promise<void> => {
    return apiClient(`/businesses/${id}`, {
      method: 'DELETE',
    });
  }
};
