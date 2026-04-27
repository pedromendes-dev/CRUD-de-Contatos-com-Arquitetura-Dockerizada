export interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export type CreateContatoPayload = {
  nome: string;
  telefone: string;
  email?: string;
};

export type UpdateContatoPayload = Partial<CreateContatoPayload>;
