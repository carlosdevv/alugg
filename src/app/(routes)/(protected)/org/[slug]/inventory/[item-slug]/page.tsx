import { Icons } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import UpdateItemForm from "./components/update-item-form";

export default function UpdateItemPage() {
  const props = {
    name: "Cadeira de Madeira",
    category: "Cadeiras",
    amount: 2,
    objectPrice: 100,
    rentPrice: 100,
    size: "",
    color: "Madeira",
    description: "",
    code: "X001",
    itemInRenovation: false,
    itemInactive: false,
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.inventory.root}>
              Estoque
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.inventory.update}>
              Detalhes do Item
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center space-x-4 mt-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={appRoutes.inventory.root}>
            <Icons.chevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-semibold text-2xl">Detalhes do Item</h1>
      </div>
      <Separator className="mt-2 mb-6" />
      <UpdateItemForm props={props} />
    </div>
  );
}
