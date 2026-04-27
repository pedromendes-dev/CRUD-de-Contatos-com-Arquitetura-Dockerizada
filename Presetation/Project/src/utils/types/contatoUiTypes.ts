import React from 'react';
import { Contato } from './contatoTypes';

export type ContatoFilterField =
  | 'todos'
  | 'id'
  | 'nome'
  | 'telefone'
  | 'email'
  | 'dataCriacao'
  | 'dataAtualizacao';

export interface ContatosTableProps {
  contatos: Contato[];
  setContatos: React.Dispatch<React.SetStateAction<Contato[]>>;
}

export type FormState = {
  open: boolean;
  editing: Contato | null;
  nome: string;
  telefone: string;
  email: string;
  saving: boolean;
};

export type FilterConfig = {
  open: boolean;
  field: ContatoFilterField;
  rawValue: string;
  debouncedValue: string;
};

export type FilterStatus = {
  processing: boolean;
  error: string;
  idSearchResult: Contato | 'not-found' | null;
  idSearchLoading: boolean;
};
