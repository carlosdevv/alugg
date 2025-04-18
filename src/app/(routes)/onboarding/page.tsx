import CreateOrganizationOnboarding from "./components/create-organization-onboarding";
import OnboardingHeader from "./components/onboarding-header";

export default async function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <OnboardingHeader />
      <CreateOrganizationOnboarding />
    </div>
  );
}
