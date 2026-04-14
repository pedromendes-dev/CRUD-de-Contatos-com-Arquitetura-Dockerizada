export function formatDatePtBr(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString('pt-BR');
}
