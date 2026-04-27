import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { ContatosTable } from '../components/contato/ContatosTable';
import { useContatoEvents } from '../hooks/contato/useContatoEvents';
import { ContatoEventType } from '../utils/types/contatoEventTypes';
import { Contato } from '../utils/types/contatoTypes';
import { Sidebar } from '../components/shared';
import { Box } from '@mui/material';

export const ContatosPage: React.FC = () => {
	const { dispatchContatoEvent } = useContatoEvents();
	const [contatos, setContatos] = useState<Contato[]>([]);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	useEffect(() => {
		(async () => {
			const data = (await dispatchContatoEvent({ type: ContatoEventType.LISTAR })) as Contato[];
			setContatos(data ?? []);
		})();
	}, [dispatchContatoEvent]);

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
			<Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />   {/* Mantém o estado do sidebar para controlar sua abertura e fechamento */}
			<Box sx={{ flex: 1, ml: sidebarOpen ? { xs: 0, sm: '270px' } : 0, p: { xs: 1, sm: 4 }, transition: 'margin 0.3s' }}>
				<Container maxWidth="md" sx={{ mt: 4 }}>
					<Paper sx={{ p: 3 }}>
								<Typography 
									variant="h5" 
									gutterBottom 
									sx={{ fontWeight: 'bold', color: '#333', mb: 3, textAlign: 'center', display: 'flex', justifyContent: 'center' }}
									align="center"
								>
									Gerenciamento de Contatos
								</Typography>
						<ContatosTable contatos={contatos} setContatos={setContatos} />
					</Paper>
				</Container>
			</Box>
		</Box>
	);
};

export default ContatosPage;
