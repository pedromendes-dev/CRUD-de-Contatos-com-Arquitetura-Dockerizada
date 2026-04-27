import { useCallback } from 'react';
import { Contato } from '../../utils/types/contatoTypes';
import { ContatoEvent, ContatoEventType } from '../../utils/types/contatoEventTypes';
import { createContato, deleteContato, getContatoById, getContatos, updateContato } from '../../services/axios/contatosAxios';

const mapContato = (item: any): Contato => ({
  id: item.id ?? item.Id,
  nome: item.nome ?? item.Nome,
  telefone: item.telefone ?? item.Telefone,
  email: item.email ?? item.Email,
  dataCriacao: item.dataCriacao ?? item.DataCriacao,
  dataAtualizacao: item.dataAtualizacao ?? item.DataAtualizacao,
});

export function useContatoEvents() {
  const dispatchContatoEvent = useCallback(async (event: ContatoEvent): Promise<Contato[] | Contato | void> => {
    switch (event.type) {
      case ContatoEventType.LISTAR: {
        const response = await getContatos();
        const contatos: Contato[] = (response.data as any[]).map(mapContato);
        return contatos;
      }
      case ContatoEventType.BUSCAR_POR_ID: {
        const response = await getContatoById(event.id);
        return mapContato(response.data);
      }
      case ContatoEventType.CRIAR: {
        const response = await createContato(event.payload);
        return response.data as Contato;
      }
      case ContatoEventType.ATUALIZAR: {
        const response = await updateContato(event.id, event.payload);
        return response.data as Contato;
      }
      case ContatoEventType.REMOVER: {
        await deleteContato(event.id);
        return;
      }
      default:
        return;
    }
  }, []);

  return { dispatchContatoEvent };
}
