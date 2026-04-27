import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Collapse,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Contato } from '../../utils/types/contatoTypes';
import { ContatoEventType } from '../../utils/types/contatoEventTypes';
import { ContatoFilterField, ContatosTableProps, FormState, FilterConfig, FilterStatus } from '../../utils/types/contatoUiTypes';
import { useContatoEvents } from '../../hooks/contato/useContatoTypes';
import { Alert, Button, Paper, Select, TextField } from '../ui';

const contatosCountCacheKey = 'contatos-count-cache';

export const ContatosTable: React.FC<ContatosTableProps> = ({ contatos, setContatos }: ContatosTableProps) => {
  const { dispatchContatoEvent } = useContatoEvents();

  const [formState, setFormState] = useState<FormState>({
    open: false,
    editing: null,
    nome: '',
    telefone: '',
    email: '',
    saving: false,
  });

  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    open: false,
    field: 'todos',
    rawValue: '',
    debouncedValue: '',
  });

  const [filterStatus, setFilterStatus] = useState<FilterStatus>({
    processing: false,
    error: '',
    idSearchResult: null,
    idSearchLoading: false,
  });

  const handleOpenCreate = () => {
    setFormState({ open: true, editing: null, nome: '', telefone: '', email: '', saving: false });
  };

  const handleOpenEdit = (contato: Contato) => {
    setFormState({ open: true, editing: contato, nome: contato.nome, telefone: contato.telefone, email: contato.email ?? '', saving: false });
  };

  const handleClose = () => {
    setFormState(prev => ({ ...prev, open: false }));
  };

  const handleSave = async () => {
    const { nome, telefone, email, editing } = formState;
    if (!nome || !telefone) return;

    try {
      setFormState(prev => ({ ...prev, saving: true }));

      if (editing) {
        await dispatchContatoEvent({
          type: ContatoEventType.ATUALIZAR,
          id: editing.id,
          payload: { nome, telefone, email },
        });

        setContatos((current: Contato[]) =>
          current.map((contato: Contato) =>
            contato.id === editing.id
              ? {
                  ...contato,
                  nome,
                  telefone,
                  email,
                  dataAtualizacao: new Date().toISOString(),
                }
              : contato,
          ),
        );
      } else {
        const createdContato = (await dispatchContatoEvent({
          type: ContatoEventType.CRIAR,
          payload: { nome, telefone, email },
        })) as Contato;

        if (createdContato) {
          setContatos((current: Contato[]) => [...current, createdContato]);
        }
      }

      sessionStorage.removeItem(contatosCountCacheKey);
      setFormState(prev => ({ ...prev, open: false }));
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
    } finally {
      setFormState(prev => ({ ...prev, saving: false }));
    }
  };

  const handleDelete = async (contato: Contato) => {
    try {
      await dispatchContatoEvent({ type: ContatoEventType.REMOVER, id: contato.id });
      setContatos((current: Contato[]) => current.filter((item: Contato) => item.id !== contato.id));
      sessionStorage.removeItem(contatosCountCacheKey);
    } catch (error) {
      console.error('Erro ao remover contato:', error);
    }
  };

  const handleClearFilter = () => {
    setFilterConfig(prev => ({ ...prev, field: 'todos', rawValue: '', debouncedValue: '' }));
    setFilterStatus({ processing: false, error: '', idSearchResult: null, idSearchLoading: false });
  };

  // Debounce do input — valida e propaga o valor após 500ms
  useEffect(() => {
    if (!filterConfig.open) {
      setFilterStatus(prev => ({ ...prev, processing: false, error: '', idSearchResult: null }));
      setFilterConfig(prev => ({ ...prev, debouncedValue: '' }));
      return;
    }

    setFilterStatus(prev => ({ ...prev, processing: true }));
    const timeoutId = window.setTimeout(() => {
      const value = filterConfig.rawValue.trim();
      setFilterConfig(prev => ({ ...prev, debouncedValue: value }));

      if (!value) {
        setFilterStatus(prev => ({ ...prev, error: '', processing: false, idSearchResult: null }));
        return;
      }

      if (filterConfig.field === 'id' && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
        setFilterStatus(prev => ({ ...prev, error: 'Informe um ID numérico válido.', processing: false }));
        return;
      }

      setFilterStatus(prev => ({ ...prev, error: '', processing: false }));
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [filterConfig.rawValue, filterConfig.field, filterConfig.open]);

  // Busca na API quando o campo de filtro e ID — usa o endpoint buscarPorId
  useEffect(() => {
    if (filterConfig.field !== 'id' || !filterConfig.debouncedValue) {
      setFilterStatus(prev => ({ ...prev, idSearchResult: null }));
      return;
    }

    const id = Number(filterConfig.debouncedValue);
    if (!Number.isInteger(id) || id <= 0) return;

    setFilterStatus(prev => ({ ...prev, idSearchLoading: true, idSearchResult: null }));

    dispatchContatoEvent({ type: ContatoEventType.BUSCAR_POR_ID, id })
      .then((result) => setFilterStatus(prev => ({ ...prev, idSearchResult: result as Contato ?? 'not-found' })))
      .catch(() => setFilterStatus(prev => ({ ...prev, idSearchResult: 'not-found' })))
      .finally(() => setFilterStatus(prev => ({ ...prev, idSearchLoading: false })));
  }, [filterConfig.debouncedValue, filterConfig.field, dispatchContatoEvent]);

  const displayedContatos = useMemo(() => {
    if (!filterConfig.open) return contatos;

    const value = filterConfig.debouncedValue.trim();
    if (!value) return contatos;

    if (filterConfig.field === 'id') {
      if (filterStatus.idSearchLoading || filterStatus.idSearchResult === null) return [];
      if (filterStatus.idSearchResult === 'not-found') return [];
      return [filterStatus.idSearchResult];
    }

    const normalizedValue = value.toLowerCase();

    return contatos.filter((contato) => {
      if (filterConfig.field === 'todos') {
        return [
          contato.id,
          contato.nome,
          contato.telefone,
          contato.email ?? '',
          contato.dataCriacao,
          contato.dataAtualizacao,
        ].some((field) => String(field).toLowerCase().includes(normalizedValue));
      }
      return String(contato[filterConfig.field] ?? '').toLowerCase().includes(normalizedValue);
    });
  }, [contatos, filterConfig.open, filterConfig.debouncedValue, filterConfig.field, filterStatus.idSearchResult, filterStatus.idSearchLoading]);

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', py: 4, px: { xs: 1, sm: 3, md: 6 } }}>
      <Stack sx={{ mb: 2, gap: 2, flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', lg: 'center' } }}>
        <h2 style={{ fontWeight: 'normal' }}>Contatos</h2>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ width: '100%', justifyContent: 'flex-end', alignItems: { xs: 'stretch', md: 'center' } }}>
          <Button variant="outlined" onClick={() => setFilterConfig(prev => ({ ...prev, open: !prev.open }))}>
            {filterConfig.open ? 'Fechar Filtro' : 'Filtro'}
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Adicionar
          </Button>
        </Stack>
      </Stack>

      <Collapse in={filterConfig.open}>
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            p: 2.5,
            border: '1px solid #d9e2ec',
            borderRadius: 2,
            backgroundColor: '#ffffff',
          }}
        >
          <Stack spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel id="contato-filter-field-label">Filtrar por</InputLabel>
              <Select
                labelId="contato-filter-field-label"
                value={filterConfig.field}
                label="Filtrar por"
                onChange={(event) => setFilterConfig(prev => ({ ...prev, field: event.target.value as ContatoFilterField }))}
              >
                <MenuItem value="todos">Todos os campos</MenuItem>
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="nome">Nome</MenuItem>
                <MenuItem value="telefone">Telefone</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="dataCriacao">Data de criação</MenuItem>
                <MenuItem value="dataAtualizacao">Data de atualização</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label={filterConfig.field === 'id' ? 'Digite o ID' : 'Digite para filtrar'}
              value={filterConfig.rawValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterConfig(prev => ({ ...prev, rawValue: e.target.value }))}
              helperText={
                filterConfig.field === 'id'
                  ? filterStatus.idSearchLoading
                    ? 'Buscando na API...'
                    : 'Consulta direta ao endpoint GET /Contatos/buscarPorId com o ID informado.'
                  : 'A busca acontece automaticamente apos 0,5 segundo, sem nova requisicao de listagem.'
              }
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="text" onClick={handleClearFilter} disabled={filterStatus.processing}>
                Limpar
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Collapse>

      {filterStatus.error ? <Alert severity="warning" sx={{ mb: 2 }}>{filterStatus.error}</Alert> : null}
      {filterConfig.field === 'id' && filterStatus.idSearchResult === 'not-found' && !filterStatus.idSearchLoading
        ? <Alert severity="info" sx={{ mb: 2 }}>Nenhum contato encontrado com o ID {filterConfig.debouncedValue}.</Alert>
        : null}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Data Criação</TableCell>
              <TableCell>Data Atualização</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedContatos.map((contato: Contato) => (
              <TableRow key={contato.id} hover>
                <TableCell>{contato.id}</TableCell>
                <TableCell>{contato.nome}</TableCell>
                <TableCell>{contato.telefone}</TableCell>
                <TableCell>{contato.email || '—'}</TableCell>
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

      <Dialog open={formState.open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{formState.editing ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                  label="Nome"
                  value={formState.nome}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormState(prev => ({ ...prev, nome: e.target.value }))}
                  fullWidth
                />
              <TextField
                  label="Telefone"
                  value={formState.telefone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormState(prev => ({ ...prev, telefone: e.target.value }))}
                  fullWidth
                />
              <TextField
                  label="Email"
                  value={formState.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth
                />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={formState.saving}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
