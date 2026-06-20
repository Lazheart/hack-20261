import { GlobalNav } from '../App';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const status = response.status;
    const navigate = GlobalNav.navigate || ((path: string) => { window.location.href = path; });
    
    if (status === 400) {
      navigate("/400");
    } else if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/401");
    } else if (status === 403) {
      navigate("/403");
    } else if (status === 404) {
      navigate("/404");
    } else if (status >= 500) {
      throw new Error("Error interno del servidor");
    } else {
      let errorMessage = "Ocurrió un error en la solicitud";
      try {
        const data = await response.json();
        errorMessage = data.error || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }
  }

  if (response.status === 204) {
    return null;
  }
  
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}
