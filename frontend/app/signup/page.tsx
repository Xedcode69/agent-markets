import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-12">
      <SignupForm />
    </main>
  );
}
