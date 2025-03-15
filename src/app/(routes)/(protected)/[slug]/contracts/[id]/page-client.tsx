"use client";

import { Button } from "@/components/ui/button";
import { useGetContractByIdService } from "@/http/contracts/use-contracts-service";
import { useRouter } from "next/navigation";
import UpdateContractPageLoading from "./loading";
import UpdateContractForm from "./components/update-contract-form";

interface UpdateContractPageClientProps {
  slug: string;
  id: string;
}

export default function UpdateContractPageClient({
  id,
  slug,
}: UpdateContractPageClientProps) {
  const router = useRouter();
  const { data: contract, isLoading } = useGetContractByIdService({
    contractId: id,
    slug,
  });

  return (
    <>
      {isLoading && <UpdateContractPageLoading />}

      {contract && !isLoading && <UpdateContractForm contract={contract} />}

      {!contract && !isLoading && (
        <div className="flex items-center space-x-6">
          <span>Contrato não encontrado.</span>
          <Button onClick={() => router.back()} variant="link">
            Voltar
          </Button>
        </div>
      )}
    </>
  );
}
