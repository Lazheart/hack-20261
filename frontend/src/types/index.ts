export interface User {
  userId: string;
  email: string;
  name?: string; // TODO: confirmar campos
}

export interface Business {
  businessId?: string; // TODO: confirmar campos
  userId?: string;     // TODO: confirmar campos
  nombre: string;
  rubro: string;
  direccion: string;
  tiene_redes: string;
  acepta_pagos_digitales: string;
  inventario_digital: string;
}

export interface Report {
  reportId?: string;   // TODO: confirmar campos
  businessId: string;
  nombre?: string;
  digitalMaturityScore: number;
  maturityLevel: string;
  summary: string;
  recommendations: any[]; // TODO: confirmar campos
  priorityActions: string[];
  quickWins: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
