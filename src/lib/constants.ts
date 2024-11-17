export const appRoutes = {
  landingPage: "/",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  forgotPassword: "/auth/forgot-password",
  onboarding: "/onboarding",
  createOrganization: "/create-organization",
  inventory: {
    root: "inventory",
    create: "inventory/create",
    update: "inventory/update",
    createCategory: "inventory/create/create-category",
  },
  user: {
    profile: "user/profile",
    settings: "user/settings",
    organizationSettings: "user/organization-settings",
  }
};
