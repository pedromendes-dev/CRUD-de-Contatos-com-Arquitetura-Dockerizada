import axios from 'axios';
import { Contato, CreateContatoPayload, UpdateContatoPayload } from '../../utils/types/contatoTypes';

// Usa variável de ambiente quando definida; caso contrário usa o proxy local.
// Assim o frontend funciona tanto no Vite quanto nos containers Docker.
export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');


// Endpoints alinhados com o ContatosController do backend

// Listar todos os contatos -  GET /Contatos/listartodos
export const getContatos = () => axios.get(`${API_URL}/Contatos/BuscarTodos`);

// Buscar um contato por ID - GET /Contatos/BuscarPorId?id=...
export const getContatoById = (id: number) =>
	axios.get<Contato>(`${API_URL}/Contatos/BuscarPorId`, { params: { id } });

// Obter apenas a quantidade total de contatos - GET /Contatos/ObterQuantidade
export const getContatosCount = () => axios.get<{ total: number }>(`${API_URL}/Contatos/ObterQuantidade`);

// Criar sem ID, dataCriacao ou dataAtualizacao, que são gerados pelo backend  - POST /Contatos/CriarNovo
export const createContato = (data: CreateContatoPayload) =>
	axios.post<Contato>(`${API_URL}/Contatos/CriarNovo`, data);

// Atualizar por ID usando query param para evitar conflitos com outros endpoints RESTful - PUT /Contatos/AtualizarId
export const updateContato = (id: number, data: UpdateContatoPayload) =>
	axios.put<Contato>(`${API_URL}/Contatos/AtualizarId`, data, { params: { id } });

// Deletar por ID usando query param para evitar conflitos com outros endpoints RESTful - DELETE /Contatos/DeletarId
export const deleteContato = (id: number) =>
	axios.delete(`${API_URL}/Contatos/DeletarId`, { params: { id } });
	