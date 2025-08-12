import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@/types/realestate";
import PropertyFormCard from "@/components/realestate/PropertyFormCard";
import PropertyCard from "@/components/realestate/PropertyCard";
import { Building2 } from "lucide-react";

const initialProperties: Property[] = [
  {
    id: "p1",
    title: "Apto contemporâneo no centro",
    description: "Apartamento com 2 quartos, vista aberta e vaga. Próximo ao metrô.",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    priceWei: 100n as unknown as number, // exemplo 0.1 ETH em wei (apenas UI)
    ownerId: "owner-1",
    isRented: false,
  },
  {
    id: "p2",
    title: "Casa ampla com jardim",
    description: "Espaço ideal para família, área gourmet e escritório iluminado.",
    imageUrl: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1600&auto=format&fit=crop",
    priceWei: 50n as unknown as number, // 0.05 ETH (apenas UI)
    ownerId: "owner-2",
    isRented: true,
  },
];

const Index = () => {
  const { toast } = useToast();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOwnerRole, setIsOwnerRole] = useState(false);
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  const currentUserId = loggedIn ? (isOwnerRole ? "owner-1" : "renter-1") : null;

  const sorted = useMemo(() => {
    const arr = [...properties];
    arr.sort((a, b) => Number(a.isRented) - Number(b.isRented)); // disponíveis primeiro
    return arr;
  }, [properties]);

  function handleCreate(property: Property) {
    setProperties((prev) => [property, ...prev]);
  }

  function handleRent(id: string, days: number) {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, isRented: true } : p)));
    toast({ title: "Solicitação enviada", description: `Imóvel selecionado para ${days} dia(s).` });
  }

  function needAuthToast() {
    toast({
      title: "Autenticação necessária",
      description: "Conecte seu projeto ao Supabase (botão verde no topo) para ativar login/cadastro.",
    });
  }

  return (
    <div className="min-h-screen relative">
      {/* Ambient gradient */}
      <div aria-hidden className="hero-ambient absolute -top-20 -left-10 right-0 h-64 rounded-full" />

      <header className="container py-6 flex items-center justify-between">
        <a href="#" className="inline-flex items-center gap-2">
          <Building2 className="text-foreground/70" />
          <span className="font-semibold">Imobiliária Wei</span>
        </a>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="login">Simular login</Label>
            <Switch id="login" checked={loggedIn} onCheckedChange={setLoggedIn} />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="role">Proprietário</Label>
            <Switch id="role" checked={isOwnerRole} onCheckedChange={setIsOwnerRole} disabled={!loggedIn} />
          </div>
          <Button variant="hero" onClick={() => document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth" })}>
            Cadastrar imóvel
          </Button>
        </div>
      </header>

      <main className="container pb-16">
        <section className="py-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Aluguel de imóveis em wei</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto"></p>
        </section>

        {!loggedIn && (
          <section aria-live="polite" className="mb-8">
            <div className="card-elevated p-4 flex items-center justify-between gap-4">
              <div className="text-left">
                <p className="font-medium">Você precisa estar logado para usar o sistema.</p>
                <p className="text-sm text-muted-foreground">Ative a autenticação para cadastrar e alugar imóveis.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={needAuthToast}>Entrar</Button>
                <Button variant="hero" onClick={needAuthToast}>Criar conta</Button>
              </div>
            </div>
          </section>
        )}

        <section id="cadastro" className="grid gap-6 md:grid-cols-2 items-start">
          {loggedIn && isOwnerRole ? (
            <PropertyFormCard currentUserId={currentUserId!} onCreate={handleCreate} />
          ) : (
            <div className="card-elevated p-6">
              <p className="font-medium mb-1">Cadastro de imóvel</p>
              <p className="text-sm text-muted-foreground">Disponível apenas para usuários proprietários autenticados.</p>
            </div>
          )}
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              currentUserId={currentUserId}
              canRent={loggedIn}
              onRent={handleRent}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
