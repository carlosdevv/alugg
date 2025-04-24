import { getUserId } from "@/actions/user/get-user-id";
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateBillingSchema = z.object({
  plan: z.enum(["pro", "elite"]),
});

// PUT /api/organizations/:slug/billing/subscription - Upgrade or downgrade the organization's plan
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const body = await req.json();

    const parsed = updateBillingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." + parsed.error.message },
        { status: 400 }
      );
    }

    const { plan } = parsed.data;

    const response = await auth.api.upgradeSubscription({
      headers: req.headers,
      body: {
        plan,
        cancelUrl: `${process.env.BETTER_AUTH_URL}/organizations/${slug}`,
        successUrl: `${process.env.BETTER_AUTH_URL}/organizations/${slug}`,
      },
    });

    if (!response.url) {
      return NextResponse.json(
        {
          message: "Erro ao atualizar o plano, entre em contato com o suporte.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { url: response.url } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}

// GET /api/organizations/:slug/billing/subscription - Get the organization's subscription
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const response = await auth.api.listActiveSubscriptions({
      headers: req.headers,
    });

    const formattedResponse = response.map((subscription) => ({
      plan: subscription.plan,
      userId: subscription.referenceId,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      status: subscription.status,
      periodStart: subscription.periodStart,
      periodEnd: subscription.periodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    }));

    return NextResponse.json({ data: formattedResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
