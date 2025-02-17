import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useParams } from "next/navigation";

export function StepOne() {
  const { slug } = useParams() as { slug: string };
  const { form } = useCreateContractContext();

  return <div className="flex flex-col gap-y-4">ada</div>;
}
