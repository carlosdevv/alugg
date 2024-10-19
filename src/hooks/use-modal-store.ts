import { create } from "zustand";

type State = {
  showOrganizationModal: boolean;
};

type Actions = {
  setShowOrganizationModal: (showOrganizationModal: boolean) => void;
};

export const useModalStore = create<State & Actions>((set) => ({
  showOrganizationModal: false,
  setShowOrganizationModal: (showOrganizationModal) =>
    set({ showOrganizationModal }),
}));
