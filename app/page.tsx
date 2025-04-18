"use client";
import FeaturedProperties from "@/components/FeaturedProperties";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import React from "react";

const page = () => {
  const { data: session, status } = useSession();
  console.log("Session data:", session);
  console.log("Session user:", session?.user);

  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProperties />
    </>
  );
};

export default page;
