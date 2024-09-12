"use client";
import { WagmiConnectionProvider } from "@/data/providers";
import { WelcomeCreateAdd } from "@/components/WelcomeAddCreate";
import { Wallet } from "@/components/Wallet";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

const isValidEthereumAddress = (slug: string | null) => {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return slug !== null && ethAddressRegex.test(slug);
};

export default function Home() {
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
}
