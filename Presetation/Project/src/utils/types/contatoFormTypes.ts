export interface ContatoFormProps {
  onSuccess?: () => void;
}

export interface FormState {
  nome: string;
  email: string;
  telefone: string;
}
