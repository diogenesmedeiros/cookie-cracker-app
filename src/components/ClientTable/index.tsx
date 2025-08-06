import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/Client";
import { PenBox } from "lucide-react";

type Props = {
  clients: Client[];
  onEditName: (ip: string, name: string) => void;
  onOpenCookies: (client: Client) => void;
};

export function ClientTable({ clients, onEditName, onOpenCookies }: Props) {
  const [modalClient, setModalClient] = useState<Client | null>(null);
  const [modalName, setModalName] = useState("");

  const openEditModal = (client: Client) => {
    setModalClient(client);
    setModalName(client.name || "");
  };

  const closeModal = () => {
    setModalClient(null);
    setModalName("");
  };

  const saveName = () => {
    if (modalClient && modalName.trim()) {
      onEditName(modalClient.ip, modalName.trim());
      closeModal();
    }
  };

  return (
    <>
      <Table>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.client_id}>
              <TableCell>{client.ip}</TableCell>
              <TableCell className="flex items-center gap-2">
                {client.name || "-"}
                <button
                  onClick={() => openEditModal(client)}
                  aria-label="Editar nome"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PenBox style={{ color: "white" }} />
                </button>
              </TableCell>
              <TableCell>
                <Button
                  className="rounded-4xl p-4"
                  onClick={() => onOpenCookies(client)}
                >
                  Ver cookies
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {modalClient && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={closeModal}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div
            className="border p-6 rounded-xl shadow-lg min-w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Editar nome do cliente</h2>
            <Input
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              placeholder="Nome"
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                className="rounded-4xl p-4 bg-red-600 text-white"
                onClick={closeModal}
              >
                Cancelar
              </Button>
              <Button onClick={saveName} className="rounded-4xl p-4">
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
