import { apiClient } from '../lib/api-client';
import type { AuthResponse } from '../types';

export const authService = {
  register: async (data: any): Promise<AuthResponse> => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  login: async (data: any): Promise<AuthResponse> => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  recovery: async (data: any): Promise<any> => {
    return apiClient('/auth/recovery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  sendEmail: async (data: any): Promise<any> => {
    return apiClient('/auth/send-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
