import { sendEmail } from "@/actions/auth/send-email";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";
import Stripe from "stripe";
import prisma from "./prismadb";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const auth = betterAuth({
  appName: "Alugg",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendEmail({
          label: "Verifique seu novo endereço de e-mail",
          to: newEmail,
          subject: "Verifique seu novo endereço de e-mail | Alugg",
          text: `Olá ${user.name}, clique no link abaixo para verificar seu novo endereço de e-mail: ${url} \n\nEste link expira em 1 hora.`,
        });
      },
    },
    additionalFields: {
      defaultOrganization: {
        type: "string",
        required: false,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "FREE",
      },
    },
  },
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
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Free",
            priceId: "price_1REDjnArAFan2Hw8yDQwuf0B", // the price id from stripe
          },
          {
            name: "Pro",
            priceId: "price_1RDz6QArAFan2Hw8kvHj8Wk5", // the price id from stripe
            annualDiscountPriceId: "price_1REDnzArAFan2Hw8KQxDDFK3", // (optional) the price id for annual billing with a discount
            // limits: {
            //   projects: 5,
            //   storage: 10,
            // },
            freeTrial: {
              days: 14,
            },
          },
        ],
      },
    }),
    openAPI(),
    nextCookies(), // must be the last plugin
  ],
});
