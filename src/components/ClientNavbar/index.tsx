import { Input } from "@/components/ui/input";

export function ClientNavbar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <div
      className="w-full py-4 px-6 flex items-center justify-between
    border-b border-white/10
    backdrop-blur-sm
    bg-gradient-to-r from-[#18181c]/90 via-[#18181c]/80 to-[#18181c]/90 
    shadow-md
    "
    >
      <div className="text-2xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</div>
      <div className="flex-1 flex justify-center">
        <Input
          placeholder="Buscar por IP ou nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full rounded-lg"
        />
      </div>
      <div className="w-[120px] text-right"></div>
    </div>
  );
}
