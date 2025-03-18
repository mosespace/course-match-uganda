import OnboardingForm from '@/components/onboarding-form';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

type Params = Promise<{ userId: string }>;

export default async function OnboardingPage({ params }: { params: Params }) {
  const { userId } = await params;

  // Verify the user exists and is an admin
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Complete Your Company Profile</h1>
        <p className="text-muted-foreground">
          Let's set up your company profile so you can start managing your
          employees.
        </p>
      </div>
      <OnboardingForm userId={userId} />
    </div>
  );
}
