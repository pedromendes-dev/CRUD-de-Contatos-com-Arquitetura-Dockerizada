import { describe, expect, it } from 'vitest';

// Replica a lógica do mapContato de useContatoEvents.ts para teste isolado.
// O mapeamento aceita campos em camelCase (frontend) ou PascalCase (backend).
function mapContato(item: Record<string, unknown>) {
  return {
    id: item['id'] ?? item['Id'],   // aqui se o resultado for undefined, ele tenta pegar o outro valor.
    nome: item['nome'] ?? item['Nome'],
    telefone: item['telefone'] ?? item['Telefone'],
    email: item['email'] ?? item['Email'],
    dataCriacao: item['dataCriacao'] ?? item['DataCriacao'],
    dataAtualizacao: item['dataAtualizacao'] ?? item['DataAtualizacao'],
  };
}

describe('mapContato — mapeamento de campos da API', () => {            // describe é usado para agrupar testes relacionados, e it é usado para definir um teste específico.
  // ─────────────────────────────────── PascalCase (resposta do backend) ───────────────────────────────────

  it('mapeia campos PascalCase do backend corretamente', () => {        // iT é usado para definir um teste específico. Ele recebe uma descrição do teste e uma função que contém a lógica do teste. Dentro dessa função, você pode usar asserções para verificar se o comportamento do código está correto.
    const item = {
      Id: 1,
      Nome: 'João Silva',
      Telefone: '11999990001',
      Email: 'joao@email.com',
      DataCriacao: '2024-01-01T00:00:00Z',
      DataAtualizacao: '2024-06-01T00:00:00Z',
    };

    const result = mapContato(item);
                                                        // expect é usado para fazer asserções sobre o resultado do teste. Ele verifica se o valor resultante é igual ao valor esperado. Se a asserção falhar, o teste será marcado como falho.
    expect(result.id).toBe(1);   // toBe compara valores - no caso se Id é igual a 1, se nome é igual a 'João Silva', etc.
    expect(result.nome).toBe('João Silva');
    expect(result.telefone).toBe('11999990001');
    expect(result.email).toBe('joao@email.com');
    expect(result.dataCriacao).toBe('2024-01-01T00:00:00Z');
    expect(result.dataAtualizacao).toBe('2024-06-01T00:00:00Z');
  });

  // ─────────────────────────────────── camelCase (já normalizado) ───────────────────────────────────

  it('mapeia campos camelCase corretamente', () => {
    const item = {
      id: 2,
      nome: 'Maria Souza',
      telefone: '11988880002',
      email: 'maria@email.com',
      dataCriacao: '2024-02-01T00:00:00Z',
      dataAtualizacao: '2024-07-01T00:00:00Z',
    };

    const result = mapContato(item);

    expect(result.id).toBe(2);
    expect(result.nome).toBe('Maria Souza');
    expect(result.telefone).toBe('11988880002');
    expect(result.email).toBe('maria@email.com');
  });

  // ─────────────────────────────────── Prioridade camelCase ───────────────────────────────────

  it('prefere camelCase quando ambos os formatos existem no objeto', () => {            
    // Simula resposta com chaves duplicadas (edge case de serialização)
    const item = {
      id: 10,
      Id: 99,
      nome: 'camelCase vence',
      Nome: 'PascalCase perde',
    };

    const result = mapContato(item);

    expect(result.id).toBe(10);
    expect(result.nome).toBe('camelCase vence');
  });

  // ─────────────────────────────────── Campos ausentes ───────────────────────────────────

  it('retorna undefined para campos ausentes em vez de lançar erro', () => {
    const item = { Id: 5 };

    const result = mapContato(item);

    expect(result.id).toBe(5);
    expect(result.nome).toBeUndefined();
    expect(result.telefone).toBeUndefined();
    expect(result.email).toBeUndefined();
  });

  it('mapeia corretamente contato com campos nulos', () => {
    const item = {
      Id: 3,
      Nome: null,
      Telefone: null,
      Email: null,
      DataCriacao: null,
      DataAtualizacao: null,
    };

    const result = mapContato(item);

    expect(result.id).toBe(3);
    expect(result.nome).toBeNull();
    expect(result.email).toBeNull();
  });
});
