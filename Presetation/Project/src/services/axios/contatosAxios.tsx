import apiClient, { API_URL } from "../../lib/apiClient";
import {
  Contato,
  CreateContatoPayload,
  UpdateContatoPayload,
} from "../../utils/types/contatoTypes";

// Usa variável de ambiente quando definida; caso contrário usa o proxy local.
// Assim o frontend funciona tanto no Vite quanto nos containers Docker.
// API_URL é re-exportado de apiClient para manter compatibilidade.
export { API_URL };

// Todos os endpoints abaixo utilizam o apiClient que injeta automaticamente
// o token JWT no header Authorization: Bearer <token> via interceptor.

// Listar todos os contatos -  GET /Contatos/listartodos
export const getContatos = () => apiClient.get("/Contatos/BuscarTodos");

// Buscar um contato por ID - GET /Contatos/BuscarPorId?id=...
export const getContatoById = (id: number) =>
  apiClient.get<Contato>("/Contatos/BuscarPorId", { params: { id } });

// Obter apenas a quantidade total de contatos - GET /Contatos/ObterQuantidade
export const getContatosCount = () =>
  apiClient.get<{ total: number }>("/Contatos/ObterQuantidade");

// Criar sem ID, dataCriacao ou dataAtualizacao, que são gerados pelo backend  - POST /Contatos/CriarNovo
export const createContato = (data: CreateContatoPayload) =>
  apiClient.post<Contato>("/Contatos/CriarNovo", data);

// Atualizar por ID usando query param para evitar conflitos com outros endpoints RESTful - PUT /Contatos/AtualizarId
export const updateContato = (id: number, data: UpdateContatoPayload) =>
  apiClient.put<Contato>("/Contatos/AtualizarId", data, { params: { id } });

// Deletar por ID usando query param para evitar conflitos com outros endpoints RESTful - DELETE /Contatos/DeletarId
export const deleteContato = (id: number) =>
  apiClient.delete("/Contatos/DeletarId", { params: { id } });
