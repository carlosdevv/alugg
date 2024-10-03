import { InterceptedSheetContent } from "@/components/intercepted-sheet-content";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CreateCategoryForm from "../../../create/create-category/components/create-category-form";

export default function CreateCategory() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Criar Categoria</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <CreateCategoryForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  );
}
