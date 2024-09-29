"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";

type InventoryItemDetailsProps = {
  title: string;
  props: {
    name: string;
    category: string;
    amount: number;
    objectPrice: number;
    rentPrice: number;
    size?: string;
    color?: string;
    description?: string;
    code?: string;
    itemInRenovation: boolean;
    itemInactive: boolean;
  };
};

export default function InventoryItemDetails({
  title,
  props,
}: InventoryItemDetailsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-4 mt-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={appRoutes.inventory.root}>
            <Icons.chevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-semibold text-2xl">{title}</h1>
      </div>
      <Separator className="mt-2 mb-6" />
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
              <CardDescription>
                Informações básicas sobre o item.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="grid space-y-2">
                <Label>Nome</Label>
                <Input placeholder="Nome do Item" value={props.name} readOnly />
              </div>

              <div className="grid space-y-2">
                <Label>Categoria</Label>
                <Input
                  placeholder="Categoria"
                  value={props.category}
                  readOnly
                />
              </div>

              <div className="grid space-y-2">
                <Label>Quantidade</Label>
                <Input placeholder="Quantidade" value={props.amount} readOnly />
              </div>

              <div className="grid space-y-2">
                <Label>Valor do Objeto</Label>
                <Input
                  placeholder="Valor do Objeto"
                  value={props.objectPrice}
                  readOnly
                />
              </div>

              <div className="grid space-y-2">
                <Label>Valor do Aluguel</Label>
                <Input
                  placeholder="Valor do Aluguel"
                  value={props.rentPrice}
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
              <CardDescription>Informações não obrigatórias.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="grid space-y-2">
                <Label>Tamanho</Label>
                <Input placeholder="Tamanho" value={props.size} readOnly />
              </div>

              <div className="grid space-y-2">
                <Label>Cor</Label>
                <Input placeholder="Cor" value={props.color} readOnly />
              </div>

              <div className="grid space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Descrição"
                  value={props.description}
                  readOnly
                  className="min-h-32"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Item</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="grid space-y-2">
                <Label>Código</Label>
                <Input placeholder="Código" value={props.code} readOnly />
              </div>

              <div className="grid space-y-2">
                <Label>Item em Reforma</Label>
                <Input
                  placeholder="Item em Reforma"
                  value={props.itemInRenovation === true ? " Sim" : "Não"}
                  readOnly
                />
              </div>

              <div className="grid space-y-2">
                <Label>Item Inativo</Label>
                <Input
                  placeholder="Item Inativo"
                  value={props.itemInactive === true ? " Sim" : "Não"}
                  readOnly
                />
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Imagem (em breve)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 flex justify-center items-center aspect-square rounded-md object-cover w-full h-52">
                <Icons.image className="size-10 text-gray-400" />
              </div>
              {/* <div className="grid gap-2">
                   <Image
                    alt="Product image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src="/placeholder.svg"
                    width="300"
                  /> 
                </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
