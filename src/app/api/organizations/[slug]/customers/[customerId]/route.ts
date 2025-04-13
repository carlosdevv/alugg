import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { NextResponse, type NextRequest } from "next/server";
import { createCustomerSchema } from "../route";

// GET /api/organizations/:slug/customers/:customerId - Get customer by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const userId = await getUserId();

    const id = params.customerId;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Cliente não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

const updateCustomerSchema = createCustomerSchema;

// PATCH /api/organizations/:slug/customers/:customerId - Update customer by ID
export async function PATCH(
  req: NextRequest,
  {
    params: { customerId, slug },
  }: { params: { slug: string; customerId: string } }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { membership } = await getUserMembership(slug);

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Cliente não encontrado." },
        { status: 404 }
      );
    }

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("update", "Customer")) {
      return NextResponse.json(
        { message: "Você não tem permissão para atualizar um cliente." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateCustomerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas: " + parsed.error },
        { status: 401 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        ...parsed.data,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/:slug/customers/:customerId – Delete a customer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; customerId: string } }
) {
  try {
    const userId = await getUserId();
    const { slug, customerId } = params;

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

    if (!customerId) {
      return NextResponse.json(
        { message: "É necessário informar o ID do cliente." },
        { status: 400 }
      );
    }

    const { membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("delete", "Customer")) {
      return NextResponse.json(
        { message: "Você não tem permissão para deletar clientes." },
        { status: 403 }
      );
    }

    const existentCustomer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!existentCustomer) {
      return NextResponse.json(
        { message: "Cliente não encontrado." },
        { status: 404 }
      );
    }

    await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });

    return NextResponse.json(
      { message: "Cliente deletado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
