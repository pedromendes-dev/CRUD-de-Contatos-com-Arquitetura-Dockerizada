import { describe, it, expect } from 'vitest';  // framework de teste utilizado, similar ao Jest
// Teste automtizado com o VItest para uma função utilitária de formatação de telefone

// Função utilitária realista: formata telefone brasileiro
function formatarTelefone(telefone: string): string {
  const limpo = telefone.replace(/\D/g, '');  // Remove tudo que não for dígito
  if (limpo.length === 11) {
    // Celular: (99) 99999-9999
    return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (limpo.length === 10) {
    // Fixo: (99) 9999-9999
    return limpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return telefone;
}

// Testes para a função formatarTelefone
describe('formatarTelefone', () => {
  it('formata celular corretamente', () => {
    expect(formatarTelefone('11987654321')).toBe('(11) 98765-4321');
    expect(formatarTelefone('(11)987654321')).toBe('(11) 98765-4321');
    expect(formatarTelefone('11 98765-4321')).toBe('(11) 98765-4321');
  });
  it('formata fixo corretamente', () => {
    expect(formatarTelefone('1132654321')).toBe('(11) 3265-4321');
    expect(formatarTelefone('(11)32654321')).toBe('(11) 3265-4321');
    expect(formatarTelefone('11 3265-4321')).toBe('(11) 3265-4321');
  });
  it('retorna original se não for telefone válido', () => {
    expect(formatarTelefone('123')).toBe('123');
    expect(formatarTelefone('abc')).toBe('abc');
  });
});



/*

it:
É uma função que define um "caso de teste". O primeiro argumento é uma descrição do que o teste faz, e o segundo é uma função que executa o teste.

expect:
É uma função usada para criar uma "expectativa" (assertiva) sobre o resultado de uma função ou valor. Você compara o resultado real com o esperado usando métodos como .toBe(), .toEqual(), etc.

describe:
Serve para agrupar vários testes relacionados, criando um "bloco" de testes com uma descrição. Isso ajuda a organizar e deixar os relatórios de teste mais claros.

*/