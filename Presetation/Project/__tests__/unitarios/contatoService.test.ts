import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';

// Mock completo do axios antes de importar o serviço
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Importa após o mock para que o módulo use o axios mockado
const {
  getContatos,
  getContatoById,
  getContatosCount,
  createContato,
  updateContato,
  deleteContato,
  API_URL,
} = await import('../../src/services/axios/contatosAxios');

describe('contatosAxios — serviço de API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────── API_URL ───────────────────────────────────

  it('API_URL usa fallback "/api" quando VITE_API_URL não está definida', () => {
    // Em ambiente de teste import.meta.env.VITE_API_URL é undefined → "/api"
    expect(API_URL).toBe('/api');
  });

  it('API_URL não termina com barra', () => {
    expect(API_URL.endsWith('/')).toBe(false);
  });

  // ─────────────────────────────────── getContatos ───────────────────────────────────

  it('getContatos faz GET para BuscarTodos', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] });

    await getContatos();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/Contatos/BuscarTodos`);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('getContatos retorna a resposta do axios', async () => {
    const contatos = [{ Id: 1, Nome: 'João' }];
    vi.mocked(axios.get).mockResolvedValue({ data: contatos });

    const result = await getContatos();

    expect(result.data).toEqual(contatos);
  });

  // ─────────────────────────────────── getContatoById ───────────────────────────────────

  it('getContatoById faz GET para BuscarPorId com o id correto', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { Id: 5, Nome: 'Maria' } });

    await getContatoById(5);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/Contatos/BuscarPorId`, {
      params: { id: 5 },
    });
  });

  // ─────────────────────────────────── getContatosCount ───────────────────────────────────

  it('getContatosCount faz GET para ObterQuantidade', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { total: 10 } });

    await getContatosCount();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/Contatos/ObterQuantidade`);
  });

  it('getContatosCount retorna o total', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { total: 42 } });

    const result = await getContatosCount();

    expect(result.data.total).toBe(42);
  });

  // ─────────────────────────────────── createContato ───────────────────────────────────

  it('createContato faz POST para CriarNovo com o payload correto', async () => {
    const payload = { nome: 'Pedro', email: 'pedro@email.com', telefone: '11999990001' };
    vi.mocked(axios.post).mockResolvedValue({ data: { Id: 1, ...payload } });

    await createContato(payload);

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/Contatos/CriarNovo`, payload);
  });

  // ─────────────────────────────────── updateContato ───────────────────────────────────

  it('updateContato faz PUT para AtualizarId com id e payload corretos', async () => {
    const payload = { nome: 'Pedro Atualizado', email: 'pedro@email.com', telefone: '11999990002' };
    vi.mocked(axios.put).mockResolvedValue({ data: {} });

    await updateContato(3, payload);

    expect(axios.put).toHaveBeenCalledWith(
      `${API_URL}/Contatos/AtualizarId`,
      payload,
      { params: { id: 3 } },
    );
  });

  // ─────────────────────────────────── deleteContato ───────────────────────────────────

  it('deleteContato faz DELETE para DeletarId com o id correto', async () => {
    vi.mocked(axios.delete).mockResolvedValue({ data: {} });

    await deleteContato(7);

    expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/Contatos/DeletarId`, {
      params: { id: 7 },
    });
  });

  // ─────────────────────────────────── Erros de rede ───────────────────────────────────

  it('getContatos propaga erro quando axios rejeita', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'));

    await expect(getContatos()).rejects.toThrow('Network Error');
  });

  it('createContato propaga erro quando axios rejeita', async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error('500 Internal Server Error'));

    await expect(
      createContato({ nome: 'Teste', email: 't@t.com', telefone: '11000000000' }),
    ).rejects.toThrow('500 Internal Server Error');
  });
});
