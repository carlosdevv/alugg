import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/customers - Get all customers
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId();
    const { slug } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { message: "É necessário informar o ID da Organização." },
        { status: 400 }
      );
    }

    const { organization } = await getUserMembership(slug);

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: {
          organizationId: organization.id,
        },
      }),
      prisma.customer.count({
        where: {
          organizationId: organization.id,
        },
      }),
    ]);

    if (total === 0) {
      return NextResponse.json({ customers: [] }, { status: 200 });
    }

    return NextResponse.json({ data: customers, total }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

export const createCustomerSchema = z.object({
  name: z.string(),
  document: z.string(),
  secondDocument: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthdate: z.string().optional(),
  mediaContact: z.string().optional(),
  additionalInformation: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  address: z.string().optional(),
});

// POST /api/organizations/:slug/customers - Create a customer
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId();
    const { slug } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { message: "É necessário informar o ID da Organização." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = createCustomerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { ...customerData } = parsed.data;
    const { membership, organization } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("create", "Customer")) {
      return NextResponse.json(
        { message: "Você não tem permissão para criar um cliente." },
        { status: 403 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        birthdate: customerData.birthdate && new Date(customerData.birthdate),
        organization: {
          connect: { id: organization.id },
        },
      },
    });

    return NextResponse.json({ customer: customer });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
