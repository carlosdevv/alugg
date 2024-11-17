import CreateInviteModal from "./create-invite-modal";
import CreateOrganizationModal from "./create-organization-modal";

export default function AppModals() {
  return (
    <>
      <CreateOrganizationModal className="bg-gray-50 px-4 py-8 sm:px-16" />

      <CreateInviteModal />
    </>
  );
}
