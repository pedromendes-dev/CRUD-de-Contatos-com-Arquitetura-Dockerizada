import { Contato } from './contatoTypes';

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export enum ContatoEventType {
  LISTAR = 'LISTAR',
  CRIAR = 'CRIAR',
  ATUALIZAR = 'ATUALIZAR',
  REMOVER = 'REMOVER',
}

export type ContatoEvent =
  | { type: ContatoEventType.LISTAR }
  | { type: ContatoEventType.CRIAR; payload: Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'> }
  | {
      type: ContatoEventType.ATUALIZAR;
      id: number;
      payload: Partial<Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'>>;
    }
  | { type: ContatoEventType.REMOVER; id: number };
