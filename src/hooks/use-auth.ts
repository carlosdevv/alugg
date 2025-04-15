"use client";

import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";

const authClient = createAuthClient({
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});

export function useAuth() {
  return {
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    signOut: authClient.signOut,
    sendVerificationEmail: authClient.sendVerificationEmail,
    forgetPassword: authClient.forgetPassword,
    resetPassword: authClient.resetPassword,
    useSession: authClient.useSession,
    authClient,
  };
}
