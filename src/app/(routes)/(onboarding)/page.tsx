import Particles from "@/components/ui/particles";
import CreateOrganizationOnboarding from "./components/create-organization-onboarding";
import OnboardingHeader from "./components/onboarding-header";

export default async function Home() {
  return (
    <>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#000"
        refresh
      />
      <OnboardingHeader />
      <CreateOrganizationOnboarding />
    </>
  );
}
