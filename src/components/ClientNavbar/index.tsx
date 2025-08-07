"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { GithubIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ClientNavbar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowTokenModal(true);
    }
  }, []);

  function handleSaveToken() {
    if (tokenInput.trim()) {
      localStorage.setItem("token", tokenInput.trim());
      setShowTokenModal(false);
    }
  }

  return (
    <>
      <div
        className="w-full py-4 px-6 flex items-center justify-between
        border-b border-white/10
        backdrop-blur-sm
        bg-gradient-to-r from-[#18181c]/90 via-[#18181c]/80 to-[#18181c]/90 
        shadow-md"
      >
        <div className="text-2xl font-bold">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </div>
        <div className="flex-1 flex justify-center">
          <Input
            placeholder="Buscar por IP ou nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md w-full rounded-lg"
          />
        </div>
        <div className="w-[120px] text-right">
          <a href={process.env.NEXT_PUBLIC_GITHUB_URL} target="_blank">
            <GithubIcon />
          </a>
        </div>
      </div>

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
    </>
  );
}