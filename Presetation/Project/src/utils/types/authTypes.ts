// Tipos do sistema de autenticação SmartReg.
// Espelham os DTOs do backend (LoginDto, AuthResponseDto).

// Payload enviado ao endpoint POST /Auth/Login
export interface LoginPayload {
  email: string;
  senha: string;
}

// Dados do usuário armazenados no contexto após login bem-sucedido
export interface AuthUser {
  nome: string;
  email: string;
}

// Resposta retornada pelo endpoint POST /Auth/Login
export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
  expiresAt: string; // ISO datetime UTC — usado para verificar expiração no cliente
}

// Contrato do AuthContext disponibilizado via useAuth()
export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // true apenas durante a leitura inicial do localStorage
  login: (data: AuthResponse) => void; // persiste token + user e atualiza o contexto
  logout: () => void; // limpa token + user do localStorage e do contexto
}
