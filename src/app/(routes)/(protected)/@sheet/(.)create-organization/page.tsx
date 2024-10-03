import { InterceptedSheetContent } from "@/components/intercepted-sheet-content";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { CreateOrganizationForm } from "@/components/create-organization-form";

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Criar Organização</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <CreateOrganizationForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  );
}
