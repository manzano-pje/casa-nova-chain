import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@/types/realestate";

export type PropertyInput = Omit<Property, "id" | "ownerId" | "isRented">;

interface PropertyFormCardProps {
  currentUserId: string;
  onCreate: (property: Property) => void;
}

const initialForm: PropertyInput = {
  title: "",
  description: "",
  imageUrl: "",
  priceWei: 0,
};

export function PropertyFormCard({ currentUserId, onCreate }: PropertyFormCardProps) {
  const [form, setForm] = useState<PropertyInput>(initialForm);
  const { toast } = useToast();

  function handleChange<T extends keyof PropertyInput>(key: T, value: PropertyInput[T]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.imageUrl || !form.description || form.priceWei <= 0) {
      toast({ title: "Preencha todos os campos", description: "Inclua título, descrição, foto e valor em wei." });
      return;
    }
    const newProperty: Property = {
      id: crypto.randomUUID(),
      ownerId: currentUserId,
      isRented: false,
      ...form,
    };
    onCreate(newProperty);
    setForm(initialForm);
    toast({ title: "Imóvel cadastrado", description: "Seu imóvel foi adicionado com sucesso." });
  }

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>Cadastro de imóvel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="imageUrl">Link para foto</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
              type="url"
              required
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Apartamento moderno no centro"
              required
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Detalhes, comodidades, proximidades..."
              required
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="priceWei">Valor por dia (wei)</Label>
            <Input
              id="priceWei"
              value={form.priceWei}
              onChange={(e) => handleChange("priceWei", Number(e.target.value))}
              placeholder="1000000000000000000"
              type="number"
              min={1}
              required
            />
          </div>
          <CardFooter className="px-0">
            <Button type="submit" variant="hero">Salvar imóvel</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default PropertyFormCard;
