import { CreateOrganizationForm } from "@/components/create-organization-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { appRoutes } from "@/lib/constants";

export default function CreateOrganization() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.home}>Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.createOrganization}>
              Criar Organização
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center space-x-4 mt-4">
        <h1 className="font-semibold text-2xl">Criar Organização</h1>
      </div>
      <Separator className="mt-2 mb-6" />
      <CreateOrganizationForm />
    </>
  );
}
