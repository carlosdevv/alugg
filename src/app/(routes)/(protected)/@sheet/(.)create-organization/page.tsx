import { CreateOrganizationForm } from "@/components/create-organization-form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";

export default function CreateOrganization() {
  return (
    <Modal showModal>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Criar nova organização</h3>
      </div>

      <CreateOrganizationForm className="bg-gray-50 px-4 py-8 sm:px-16" />
    </Modal>
  );
}
