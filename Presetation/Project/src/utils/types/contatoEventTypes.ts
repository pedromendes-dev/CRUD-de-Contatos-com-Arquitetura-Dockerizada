import { Contato } from './contatoTypes';

// Enum que representa todas as acoes possiveis sobre contatos.
// Cada valor string corresponde ao nome do endpoint no backend (ex: 'ListarTodos' -> GET /Contatos/listartodos).
// Usar enum evita strings soltas espalhadas pelo codigo — se mudar o nome de uma acao,
// muda so aqui e o TypeScript aponta todos os lugares que precisam ser atualizados.
export enum ContatoEventType {
  LISTAR        = 'ListarTodos',  // GET /Contatos/listartodos        — lista todos os contatos
  BUSCAR_POR_ID = 'BuscarPorId',  // GET /Contatos/buscarPorId?id=X   — busca um contato especifico pela API
  CRIAR         = 'CriarId',      // POST /Contatos/criar             — cria um novo contato
  ATUALIZAR     = 'AtualizarId',  // PUT /Contatos/atualizar?id=X     — atualiza dados de um contato existente
  REMOVER       = 'RemoverId',    // DELETE /Contatos/remover?id=X    — remove um contato pelo ID
}

// Union type que descreve o "contrato" de cada evento despachado para o hook useContatoEvents.
// Cada variante carrega exatamente os dados que aquela acao precisa — nem mais, nem menos.
// O TypeScript usa discriminated union: ao checar event.type, ele sabe automaticamente
// quais outros campos estao disponiveis (ex: se type === ATUALIZAR, sabe que id e payload existem).
export type ContatoEvent =
  | { type: ContatoEventType.LISTAR }
  | { type: ContatoEventType.BUSCAR_POR_ID; id: number }
  | { type: ContatoEventType.CRIAR; payload: Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'> }
  | {
      type: ContatoEventType.ATUALIZAR;
      id: number;
      payload: Partial<Omit<Contato, 'id' | 'dataCriacao' | 'dataAtualizacao'>>;
    }
  | { type: ContatoEventType.REMOVER; id: number };
