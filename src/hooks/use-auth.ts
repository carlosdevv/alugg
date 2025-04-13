"use client";

import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

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
