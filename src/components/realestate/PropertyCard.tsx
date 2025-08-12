import { useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@/types/realestate";
import { CalendarDays, Home } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  currentUserId: string | null;
  canRent: boolean;
  onRent: (id: string, days: number) => void;
}

export function PropertyCard({ property, currentUserId, canRent, onRent }: PropertyCardProps) {
  const [days, setDays] = useState<number>(1);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const isOwner = currentUserId && property.ownerId === currentUserId;
  const totalWei = useMemo(() => BigInt(Math.max(0, days)) * BigInt(property.priceWei), [days, property.priceWei]);

  const isDisabled = !canRent || !!isOwner || property.isRented || days < 1;

  function handleRent() {
    if (!canRent) {
      toast({ title: "Faça login para alugar", description: "Conecte a autenticação para continuar." });
      return;
    }
    if (isOwner) {
      toast({ title: "Ação não permitida", description: "O proprietário não pode alugar o próprio imóvel." });
      return;
    }
    onRent(property.id, days);
  }

  return (
    <Card className={`relative overflow-hidden card-elevated ${property.isRented ? "opacity-60" : ""}`}>
      {property.isRented && (
        <div className="absolute inset-0 grid place-items-center bg-background/40">
          <Badge variant="secondary">Alugado</Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="text-foreground/60" />
            {property.title}
          </CardTitle>
          {isOwner && <Badge>Você é o proprietário</Badge>}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <img
          src={property.imageUrl}
          alt={`Imóvel: ${property.title} — ${property.description}`}
          loading="lazy"
          className="w-full h-52 object-cover rounded-md"
        />
        {/* Preço sempre visível */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Valor por dia</span>
          <span className="font-semibold">{property.priceWei.toString()} wei</span>
        </div>

        {expanded && (
          <>
            <p className="text-sm text-muted-foreground text-left">{property.description}</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 grid gap-1 text-left">
                <label className="text-sm flex items-center gap-2"><CalendarDays className="text-foreground/60" />Dias de locação</label>
                <Input
                  type="number"
                  min={1}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div className="text-right sm:w-56">
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-lg font-semibold break-all">{totalWei.toString()} wei</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
        </Button>
        {expanded && (
          <Button onClick={handleRent} variant="hero" disabled={isDisabled}>Alugar</Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;
