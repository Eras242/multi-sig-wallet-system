import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      <div className=" hidden w-64 flex-col border-r bg-background md:flex">
        <nav className="flex-1 space-y-2 px-4 py-6">
          <h1 className="font-semibold">Stone+ Multisig</h1>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            Wallet 1
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            Wallet 2
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            Add Wallet +
          </Link>
        </nav>
      </div>
      <div className="flex-1 flex-col px-8 py-8  gap-3">
        <div className="flex items-center">
          <h1 className="font-bold text-4xl">Loading Wallet Name ...</h1>
        </div>
        <div className="flex  h-40 items-center">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-left">
              <div className="text-4xl font-bold">$42,356.78</div>
              <div className="flex items-center gap-2">
                {/* <WalletIcon className="h-6 w-6" /> */}
                <span className="text-sm text-muted-foreground">3 Wallets</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex  h-40 items-center"></div>
      </div>
    </div>
  );
}
