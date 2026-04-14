import axios from 'axios';
import { Contato } from '../../utils/contato/contatoTypes';

// Em desenvolvimento usamos a API na porta 3000;
// em produção o VITE_API_URL será sobrescrito (ex.: 8080 via nginx).
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Endpoints alinhados com o ContatosController do backend
export const getContatos = () => axios.get(`${API_URL}/Contatos/listartodos`);
export const createContato = (data: Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'>) =>
	axios.post<Contato>(`${API_URL}/Contatos/criarNovo`, data);
export const updateContato = (id: number, data: Partial<Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'>>) =>
	axios.put<Contato>(`${API_URL}/Contatos/atualizarId`, data, { params: { id } });
export const deleteContato = (id: number) =>
	axios.delete(`${API_URL}/Contatos/deletarId`, { params: { id } });
