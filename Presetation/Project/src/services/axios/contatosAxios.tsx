import axios from 'axios';
import { Contato, CreateContatoPayload, UpdateContatoPayload } from '../../utils/contato/contatoTypes';

// Usa variável de ambiente quando definida; caso contrário usa o proxy local.
// Assim o frontend funciona tanto no Vite quanto nos containers Docker.
export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');


// Endpoints alinhados com o ContatosController do backend

// Listar todos os contatos -  GET /Contatos/listartodos
export const getContatos = () => axios.get(`${API_URL}/Contatos/listartodos`);

// Obter apenas a quantidade total de contatos - GET /Contatos/quantidade
export const getContatosCount = () => axios.get<{ total: number }>(`${API_URL}/Contatos/quantidade`);

// Criar sem ID, dataCriacao ou dataAtualizacao, que são gerados pelo backend  - POST /Contatos/criarNovo
export const createContato = (data: CreateContatoPayload) =>
	axios.post<Contato>(`${API_URL}/Contatos/criarNovo`, data);

// Atualizar por ID usando query param para evitar conflitos com outros endpoints RESTful - PUT /Contatos/atualizarId
export const updateContato = (id: number, data: UpdateContatoPayload) =>
	axios.put<Contato>(`${API_URL}/Contatos/atualizarId`, data, { params: { id } });

// Deletar por ID usando query param para evitar conflitos com outros endpoints RESTful - DELETE /Contatos/deletarId
export const deleteContato = (id: number) =>
	axios.delete(`${API_URL}/Contatos/deletarId`, { params: { id } });
