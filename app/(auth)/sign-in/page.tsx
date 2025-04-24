import SignInForm from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const SignInPage = () => {
  return (
    <Suspense fallback={
      <header className="flex items-center justify-center h-[80vh]">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="bg-transparent cursor-wait text-black"
          disabled
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      </div>
      </header>
    }>

      <SignInForm />
      
    </Suspense>
  );
};

export default SignInPage;
