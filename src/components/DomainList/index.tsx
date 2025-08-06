import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Domain } from "@/types/Domain";

type Props = {
  domains: Domain[];
};

export function DomainList({ domains }: Props) {
  const [modalSearch, setModalSearch] = useState("");
  const [openDomains, setOpenDomains] = useState<Set<string>>(new Set());

  const domainRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const setDomainRef = useCallback(
    (domain: string) => (el: HTMLDivElement | null) => {
      domainRefs.current[domain] = el;
    },
    []
  );

  const scrollToDomain = (domain: string) => {
    const ref = domainRefs.current[domain];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpenDomains((prev) => new Set(prev).add(domain));
    }
  };

  const toggleDomain = (domain: string) => {
    setOpenDomains((prev) => {
      const copy = new Set(prev);
      if (copy.has(domain)) copy.delete(domain);
      else copy.add(domain);
      return copy;
    });
  };

  const filteredDomains = domains.filter((domain) =>
    `${domain.domain} ${domain.cookies.map((c) => c.name).join(" ")}`
      .toLowerCase()
      .includes(modalSearch.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Buscar por domínio ou nome do cookie"
        value={modalSearch}
        onChange={(e) => setModalSearch(e.target.value)}
        className="my-4 w-full rounded border p-2"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {filteredDomains.map((d) => (
          <Button
            key={d.domain}
            variant="outline"
            size="sm"
            onClick={() => scrollToDomain(d.domain)}
          >
            {d.domain}
          </Button>
        ))}
      </div>

      {filteredDomains.map((domain, idx) => {
        const isOpen = openDomains.has(domain.domain);
        return (
          <div
            key={idx}
            ref={setDomainRef(domain.domain)}
            className="border rounded p-4 mb-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{domain.domain}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleDomain(domain.domain)}
              >
                {isOpen ? "Fechar" : "Abrir"}
              </Button>
            </div>

            {isOpen && (
              <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                {domain.cookies.map((cookie, i) => (
                  <li key={i}>
                    <span className="font-medium">{cookie.name}</span>:{" "}
                    {cookie.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}