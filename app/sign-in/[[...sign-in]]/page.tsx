"use client";

import BackgroundAnimation from "@/components/Animation/Animation";
import SignInForm from "@/components/AuthPage/SignInPage";

function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10 w-full max-w-md px-4">
        <SignInForm />
      </div>
    </main>
  );
}
export default SignInPage;
