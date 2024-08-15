import { WagmiConnectionProvider } from "@/data/providers";

import { Sidebar } from "@/components/Sidebar";
import { Wallet } from "@/components/Wallet";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WelcomeCreateAdd } from "@/components/WelcomeAddCreate";

export default function Home() {
  return (
    <WagmiConnectionProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        {/* <Wallet /> */}
        <WelcomeCreateAdd />
      </div>
    </WagmiConnectionProvider>
  );
}
