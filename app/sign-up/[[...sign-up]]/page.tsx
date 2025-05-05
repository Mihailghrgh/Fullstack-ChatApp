"use client";

import BackgroundAnimation from "@/components/Animation/Animation";
import SignUpForm from "@/components/AuthPage/SignUpPage";

function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10 w-full max-w-md px-4">
        <SignUpForm />
      </div>
    </main>
  );
}
export default SignUpPage;
