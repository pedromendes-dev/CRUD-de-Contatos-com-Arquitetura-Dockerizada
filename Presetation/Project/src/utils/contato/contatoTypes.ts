export interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}


export interface ContatosTableProps {
  contatos: Contato[];
  setContatos: (contatos: Contato[]) => void;
}