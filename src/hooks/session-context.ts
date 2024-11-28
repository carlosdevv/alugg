import { create } from "zustand";

type State = {
  slug: string;
};

type Action = {
  setSlug: (slug: string) => void;
};

const sessionStore = create<State & Action>((set, get) => ({
  slug: "",
  setSlug: (slug) => {
    if (get().slug !== slug) {
      set({ slug });
    }
  },
}));

export default sessionStore;
