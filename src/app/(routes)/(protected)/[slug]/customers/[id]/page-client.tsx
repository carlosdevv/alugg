"use client";

import { Button } from "@/components/ui/button";
import { useGetCustomerByIdService } from "@/http/customers/use-customers-service";
import { useRouter } from "next/navigation";
import UpdateCustomerForm from "./components/update-customer-form";
import UpdateCustomerPageLoading from "./loading";

interface UpdateCustomerPageClientProps {
  slug: string;
  id: string;
}

export default function UpdateCustomerPageClient({
  id,
  slug,
}: UpdateCustomerPageClientProps) {
  const router = useRouter();
  const { data: customer, isLoading } = useGetCustomerByIdService({
    customerId: id,
    slug,
  });

  return (
    <>
      {isLoading && <UpdateCustomerPageLoading />}

      {customer && !isLoading && (
        <UpdateCustomerForm customer={customer} id={id} />
      )}

      {!customer && !isLoading && (
        <div className="flex items-center space-x-6">
          <span>Cliente não encontrado.</span>
          <Button onClick={() => router.back()} variant="link">
            Voltar
          </Button>
        </div>
      )}
    </>
  );
}
