import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { ContatosTable } from '../components/contato/ContatosTable';
import { useContatoEvents } from '../hooks/contato/useContatoEvents';
import { ContatoEventType } from '../utils/contato/contatoEvents';
import { Contato } from '../utils/contato/contatoTypes';

export const ContatosPage: React.FC = () => {
	const { dispatchContatoEvent } = useContatoEvents();
	const [contatos, setContatos] = useState<Contato[]>([]);

	useEffect(() => {
		(async () => {
			const data = (await dispatchContatoEvent({ type: ContatoEventType.LISTAR })) as Contato[];
			setContatos(data ?? []);
		})();
	}, [dispatchContatoEvent]);

	return (
		<Container maxWidth="md" sx={{ mt: 4 }}>
			<Paper sx={{ p: 3 }}>
				<Typography variant="h5" gutterBottom>
					Gerenciamento de Contatos
				</Typography>
				<ContatosTable contatos={contatos} setContatos={setContatos} />
			</Paper>
		</Container>
	);
};

export default ContatosPage;
