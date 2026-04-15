import axios from 'axios';
import { Contato } from '../../utils/contato/contatoTypes';

// Compatibilidade para ambientes onde Omit não é reconhecido
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Usa variável de ambiente quando definida; caso contrário usa mesma origem
// (funciona com proxy no Vite e com deploy atrás de gateway/nginx).
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');


// Endpoints alinhados com o ContatosController do backend

// Listar todos os contatos
export const getContatos = () => axios.get(`${API_URL}/Contatos/listartodos`);

// Criar sem ID, dataCriacao ou dataAtualizacao, que são gerados pelo backend
export const createContato = (data: Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'>) =>
	axios.post<Contato>(`${API_URL}/Contatos/criarNovo`, data);

// Atualizar por ID usando query param para evitar conflitos com outros endpoints RESTful
export const updateContato = (id: number, data: Partial<Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'>>) =>
	axios.put<Contato>(`${API_URL}/Contatos/atualizarId`, data, { params: { id } });

// Deletar por ID usando query param para evitar conflitos com outros endpoints RESTful
export const deleteContato = (id: number) =>
	axios.delete(`${API_URL}/Contatos/deletarId`, { params: { id } });
