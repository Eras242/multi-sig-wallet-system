import { WagmiConnectionProvider } from "@/data/providers";
import { WelcomeCreateAdd } from "@/components/WelcomeAddCreate";

export default function Home() {
  return (
    <WagmiConnectionProvider>
      <WelcomeCreateAdd />
    </WagmiConnectionProvider>
  );
}
