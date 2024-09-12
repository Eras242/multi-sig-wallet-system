"use client";
import React from "react";
import { WelcomeCreateAdd } from "@/components/WelcomeAddCreate";
import { usePathname } from "next/navigation";
import { Wallet } from "@/components/Wallet";

const isValidEthereumAddress = (slug: string | string[] | undefined) => {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (typeof slug === "string") {
    return ethAddressRegex.test(slug);
  }
  return false;
};

const page = () => {
  const pathname = usePathname();

  // Extract the slug (Ethereum address) from the pathname
  const slug = pathname?.split("/")[1] || null;

  // If there is no slug, render the WelcomeCreateAdd component
  if (!slug) {
    return <WelcomeCreateAdd />;
  }

  // If the slug is a valid Ethereum address, render the Wallet component
  if (isValidEthereumAddress(slug)) {
    return <Wallet />;
  }

  // Default fallback for invalid slugs
  return <WelcomeCreateAdd />;
};

export default page;
