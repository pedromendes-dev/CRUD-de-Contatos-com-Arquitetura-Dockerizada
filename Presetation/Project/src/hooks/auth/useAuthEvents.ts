import { useCallback, useState } from "react";
import { loginUsuario } from "../../services/axios/authAxios";
import { AuthResponse, LoginPayload } from "../../utils/types/authTypes";

// Hook que encapsula a chamada ao endpoint de login.
// Segue o mesmo padrão de useContatoEvents: isola o acesso ao serviço Axios
// e expõe apenas a função de dispatch para o componente.
export function useAuthEvents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Tenta autenticar o usuário com as credenciais fornecidas.
  // Retorna AuthResponse em caso de sucesso, ou null se as credenciais forem inválidas.
  const dispatchLogin = useCallback(async (payload: LoginPayload): Promise<AuthResponse | null> => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUsuario(payload);
      return response.data;
    } catch (err: any) {
      // Exibe a mensagem retornada pelo backend quando disponível; fallback genérico caso contrário
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage ?? "Erro ao realizar login. Tente novamente.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { dispatchLogin, loading, error, setError };
}
