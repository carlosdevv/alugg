import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { appRoutes } from "@/lib/constants";

export default function CreateItemPage() {
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
            <BreadcrumbLink href={appRoutes.inventory.createItem}>
              Criar Item
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="font-semibold text-2xl mt-4">Criar Item</h1>
      <Separator className="my-2" />
    </div>
  );
}
