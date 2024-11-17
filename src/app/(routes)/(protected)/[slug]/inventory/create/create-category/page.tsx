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
import CreateCategoryForm from "./components/create-category-form";

export default function CreateCategoryPage() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.inventory.root}>
              Estoque
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.inventory.create}>
              Criar Item
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.inventory.createCategory}>
              Criar Categoria
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center space-x-4 mt-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={appRoutes.inventory.create}>
            <Icons.chevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-semibold text-2xl hover:cursor-pointer">Criar Categoria</h1>
      </div>
      <Separator className="mt-2 mb-6" />
      <CreateCategoryForm />
    </>
  );
}
