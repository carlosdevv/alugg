import { appRoutes } from "@/lib/constants";
import { redirect } from "next/navigation";

export default function NotFound() {
  return redirect(appRoutes.onboarding);
}
