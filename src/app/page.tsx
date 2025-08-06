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

type Client = {
  client_id: number;
  ip: string;
  name: string | null;
  domains: Domain[];
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const filteredClients = clients.filter((c) =>
    `${c.ip} ${c.name}`.toLowerCase().includes(search.toLowerCase())
  );

  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjp0cnVlLCJpYXQiOjE3NTQ0ODc2MjAsImV4cCI6NDkxMDI0NzYyMH0.sP5AqM5nCx3ScK1lyePXvFdp_UL-ceE_Fg-7gQWd1V8";

  const fetchClients = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    const data = await res.json();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSaveName = async (ip: string, name: string) => {
    if (!name) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/set-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ ip, name }),
    });
    await fetchClients();
  };

  if (loading)
    return <div className="p-4 text-muted-foreground">Carregando...</div>;

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
      </div>
    </div>
  );
}
