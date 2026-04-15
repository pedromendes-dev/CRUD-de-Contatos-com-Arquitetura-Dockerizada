import { describe, it, expect } from 'vitest';


// Função utilitária realista: formata telefone brasileiro
function formatarTelefone(telefone: string): string {
  // Remove tudo que não for dígito
  const limpo = telefone.replace(/\D/g, '');
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


