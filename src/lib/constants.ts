export const appRoutes = {
  // Public routes
  plans: "/plans",
  landing: "/",

  // Auth routes
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  verifyEmail: "/auth/verify-email",
  resetPassword: "/auth/reset-password",

  // Private routes
  onboarding: "/onboarding",
  categories: {
    root: "categories",
    create: "categories/create",
    edit: "categories/edit",
  },
  items: {
    root: "items",
    create: "items/create",
  },
  customers: {
    root: "customers",
    create: "customers/create",
  },
  contracts: {
    root: "contracts",
    create: "contracts/create",
  },
};
