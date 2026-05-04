import axios from "axios";
import { API_URL } from "../../lib/apiClient";
import { AuthResponse, LoginPayload } from "../../utils/types/authTypes";

// Serviço de autenticação — usa axios puro (sem interceptor de token)
// porque no momento do login o usuário ainda não possui token.

// Autentica o usuário — POST /Auth/Login — retorna token JWT e dados do usuário
export const loginUsuario = (payload: LoginPayload) =>
  axios.post<AuthResponse>(`${API_URL}/Auth/Login`, payload);
