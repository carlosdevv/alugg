import { sendEmail } from "@/actions/auth/send-email";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";
import prisma from "./prismadb";

export const auth = betterAuth({
  appName: "Alugg",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        label: "Redefina sua senha",
        to: user.email,
        subject: `Redefina sua senha | Alugg`,
        text: `Olá ${user.name}, clique no link abaixo para redefinir sua senha: ${url} \n\nEste link expira em 1 hora.`,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const callbackURL = `${process.env.BETTER_AUTH_URL}/auth/verify-email`;
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${callbackURL}`;

      await sendEmail({
        to: user.email,
        subject: "Verifique seu endereço de e-mail | Alugg",
        text: `Olá ${user.name}, clique no link abaixo para verificar seu endereço de e-mail: ${verificationUrl} \n\nEste link expira em 1 hora.`,
      });
    },
    expiresIn: 3600, // 1 hour
  },
  plugins: [nextCookies(), openAPI()],
});
