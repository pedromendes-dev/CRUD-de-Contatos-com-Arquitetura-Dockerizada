import axios from "axios";

// URL base da API — mesma lógica do contatosAxios: env var ou proxy local Docker
export const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

// Instância Axios compartilhada por todos os serviços autenticados.
// O interceptor de request lê o token do localStorage em cada chamada,
// garantindo que o header esteja sempre atualizado após login/logout.
const apiClient = axios.create({ baseURL: API_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartreg_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Bearer é o portador padrão para tokens JWT
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("smartreg_token");
      localStorage.removeItem("smartreg_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
