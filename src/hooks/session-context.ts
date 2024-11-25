import { create } from "zustand";
import { CategoryModel } from "../http/category/types";

type State = {
  slug: string;
  organizationCategories: CategoryModel[];
};

type Action = {
  setCategories: (categories: CategoryModel[] | undefined) => void;
  addCategory: (category: CategoryModel) => void;
  removeCategory: (category: CategoryModel) => void;
  setSlug: (slug: string) => void;
};

const sessionStore = create<State & Action>((set) => ({
  slug: "",
  organizationCategories: [],
  setCategories: (organizationCategories) => set({ organizationCategories }),
  addCategory: (category) => {
    set((state) => ({
      organizationCategories: [...state.organizationCategories, category],
    }));
  },
  removeCategory: (category) => {
    set((state) => ({
      organizationCategories: state.organizationCategories.filter(
        (c) => c.id !== category.id
      ),
    }));
  },
  setSlug: (slug) => set({ slug }),
}));

export default sessionStore;
