import { WagmiConnectionProvider } from "@/data/providers";

import { Sidebar } from "@/components/Sidebar";
import { Wallet } from "@/components/Wallet";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <WagmiConnectionProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        {/* <Wallet /> */}
        <div className="flex items-center justify-center flex-col px-8 py-8 gap-4 bg-red-400 w-full">
          <h1 className="font-bold text-4xl "> Welcome </h1>
          <div className="bg-gray-400">
            <h2 className="container-md">
              Whether you're looking to create a new multisig wallet or manage
              an existing one, you've come to the right place. Start by setting
              up a secure, collaborative wallet or seamlessly integrate an
              existing one to take control of your assets with confidence.
            </h2>
          </div>
          <Button>Add Wallet</Button>
          <Button>Create Multisig Wallet</Button>
        </div>
      </div>
    </WagmiConnectionProvider>
  );
}
