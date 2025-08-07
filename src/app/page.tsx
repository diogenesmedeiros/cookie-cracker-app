"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientTable } from "@/components/ClientTable";
import { DomainList } from "@/components/DomainList";
import { Domain } from "@/types/Domain";
import { ClientNavbar } from "@/components/ClientNavbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Client = {
  client_id: number;
  ip: string;
  name: string | null;
  domains: Domain[];
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [showTokenModal, setShowTokenModal] = useState(false);

  const filteredClients = clients.filter((c) =>
    `${c.ip} ${c.name}`.toLowerCase().includes(search.toLowerCase())
  );

  const fetchClients = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClients(data);
    } catch {
      console.error("Erro ao buscar clientes");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      setShowTokenModal(true);
    } else {
      setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (token) fetchClients();
  }, [token]);

  const handleSaveToken = () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    localStorage.setItem("token", trimmed);
    setToken(trimmed);
    setShowTokenModal(false);
  };

  const handleSaveName = async (ip: string, name: string) => {
    if (!name || !token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/set-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ip, name }),
    });
    await fetchClients();
  };

  return (
    <div>
      <ClientNavbar search={search} setSearch={setSearch} />

      <div className="p-6 space-y-4">
        <ClientTable
          clients={filteredClients}
          onEditName={handleSaveName}
          onOpenCookies={(client: Client) => setSelectedClient(client)}
        />

        <Dialog
          open={!!selectedClient}
          onOpenChange={(open) => !open && setSelectedClient(null)}
        >
          <DialogTrigger />
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cookies de {selectedClient?.ip}</DialogTitle>
              <DialogDescription>
                {selectedClient?.name
                  ? `Nome: ${selectedClient.name}`
                  : "Sem nome definido"}
              </DialogDescription>
            </DialogHeader>

            {selectedClient && <DomainList domains={selectedClient.domains} />}
          </DialogContent>
        </Dialog>

        <Dialog open={showTokenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Informe o token</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Token de acesso"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="mt-2"
            />
            <Button className="mt-4 w-full" onClick={handleSaveToken}>
              Salvar Token
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}