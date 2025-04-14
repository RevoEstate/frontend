import React from "react";
import { Metadata } from "next";
import { CustomerSignupForm } from "./customer-signup-form";

export const metadata: Metadata = {
  title: "Customer Sign Up",
};

const CustomerSignUpPage = async () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <CustomerSignupForm />
    </div>
  );
};

export default CustomerSignUpPage;
