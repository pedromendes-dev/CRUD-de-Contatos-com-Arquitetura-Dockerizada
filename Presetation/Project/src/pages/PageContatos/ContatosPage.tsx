import React, { useEffect, useState } from "react";
import { ContatosTable } from "../../components/contato/ContatosTable";
import { useContatoEvents } from "../../hooks/contato/useContatoEvents";
import { ContatoEventType } from "../../utils/types/contatoEventTypes";
import { Contato } from "../../utils/types/contatoTypes";
import { Sidebar } from "../../components/shared";

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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "270px" : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <ContatosTable contatos={contatos} setContatos={setContatos} />
      </div>
    </div>
  );
};

export default ContatosPage;
