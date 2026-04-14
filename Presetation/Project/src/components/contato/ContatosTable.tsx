import React, { useState, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Contato } from '../../utils/contato/contatoTypes';
import { useContatoEvents } from '../../hooks/contato/useContatoEvents';
import { ContatoEventType } from '../../utils/contato/contatoEvents';

interface ContatosTableProps {
  contatos: Contato[];
  setContatos: (contatos: Contato[]) => void;
}

export const ContatosTable: React.FC<ContatosTableProps> = ({ contatos, setContatos }: ContatosTableProps) => {
  const { dispatchContatoEvent } = useContatoEvents();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contato | null>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleOpenCreate = () => {
    setEditing(null);
    setNome('');
    setTelefone('');
    setOpen(true);
  };

  const handleOpenEdit = (contato: Contato) => {
    setEditing(contato);
    setNome(contato.nome);
    setTelefone(contato.telefone);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!nome || !telefone) return;

    if (editing) {
      await dispatchContatoEvent({
        type: ContatoEventType.ATUALIZAR,
        id: editing.id,
        payload: { nome, telefone },
      });

      const updated = contatos.map((c: Contato) =>
        c.id === editing.id ? { ...c, nome, telefone, dataAtualizacao: new Date().toISOString() } : c,
      );
      setContatos(updated);
    } else {
      const created = (await dispatchContatoEvent({
        type: ContatoEventType.CRIAR,
        payload: {
          nome,
          telefone,
          email: undefined,
        },
      })) as Contato;

      if (created) {
        setContatos([...contatos, created]);
      } else {
        const fallback: Contato = {
          id: Math.max(0, ...contatos.map((c: Contato) => c.id)) + 1,
          nome,
          telefone,
          email: undefined,
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString(),
        };
        setContatos([...contatos, fallback]);
      }
    }

    setOpen(false);
  };

  const handleDelete = async (contato: Contato) => {
    await dispatchContatoEvent({ type: ContatoEventType.REMOVER, id: contato.id });
    setContatos(contatos.filter((c) => c.id !== contato.id));
  };

  return (
    <>
      <Stack sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Contatos</h2>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          Adicionar
        </Button>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data Criação</TableCell>
              <TableCell>Data Atualização</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contatos.map((contato: Contato) => (
              <TableRow key={contato.id} hover>
                <TableCell>{contato.nome}</TableCell>
                <TableCell>{contato.telefone}</TableCell>
                <TableCell>{new Date(contato.dataCriacao).toLocaleString('pt-BR')}</TableCell>
                <TableCell>{new Date(contato.dataAtualizacao).toLocaleString('pt-BR')}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenEdit(contato)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(contato)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                  label="Nome"
                  value={nome}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                  fullWidth
                />
              <TextField
                  label="Telefone"
                  value={telefone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
                  fullWidth
                />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
