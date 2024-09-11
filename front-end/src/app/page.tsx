import { WagmiConnectionProvider } from "@/data/providers";
import { WelcomeCreateAdd } from "@/components/WelcomeAddCreate";
import { useRouter } from "next/router";

export default function Home() {
  return <WelcomeCreateAdd />;
}
