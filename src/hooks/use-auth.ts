"use client";

import { createAuthClient } from "better-auth/react";

export function useAuth() {
  const { signIn, signUp, signOut, sendVerificationEmail, ...authClient } =
    createAuthClient();

  return {
    signIn,
    signUp,
    signOut,
    sendVerificationEmail,
    authClient,
  };
}
