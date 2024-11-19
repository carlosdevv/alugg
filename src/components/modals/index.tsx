import CreateCategoryModal from "./create-category-modal";
import CreateInviteModal from "./create-invite-modal";
import CreateOrganizationModal from "./create-organization-modal";
import UpdateCategoryModal from "./update-category-modal";

export default function AppModals() {
  return (
    <>
      <CreateOrganizationModal className="bg-gray-50 px-4 py-8 sm:px-16" />

      <CreateInviteModal />

      <CreateCategoryModal />
      <UpdateCategoryModal />
    </>
  );
}
