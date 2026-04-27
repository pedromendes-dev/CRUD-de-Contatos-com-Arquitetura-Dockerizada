import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useContatoEvents } from '../../hooks/contato/useContatoTypes';
import { ContatoEventType } from '../../utils/types/contatoEventTypes';

interface ContatoFormProps {
  onSuccess?: () => void;
}

interface FormState {
  nome: string;
  email: string;
  telefone: string;
}

export const ContatoForm: React.FC<ContatoFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<FormState>({ nome: '', email: '', telefone: '' });
  const [loading, setLoading] = useState(false);
  const { dispatchContatoEvent } = useContatoEvents();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatchContatoEvent({
        type: ContatoEventType.CRIAR,
        payload: {
          nome: form.nome,
          telefone: form.telefone,
          email: form.email || undefined,
        },
      });

      setForm({ nome: '', email: '', telefone: '' });
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <TextField
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
        />
        <TextField
          label="Telefone"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Contato'}
        </Button>
      </Stack>
    </form>
  );
};
