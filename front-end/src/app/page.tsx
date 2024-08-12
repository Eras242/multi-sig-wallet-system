import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import { SubmitTransaction } from "@/components/SubmitTransaction";

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
      <div className=" flex flex-1 flex-col px-8 py-8 gap-4 bg">
        <div className="flex items-center  h-12 ">
          <h1 className="font-bold text-4xl">MultiSig Wallet 1</h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Card className="">
            <CardHeader>
              <CardTitle>Total ETH Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-left">
              <div className="text-4xl font-bold">$9,341.31</div>
              <div className="text-2xl font-semibold text-muted-foreground">
                Ξ 3.23
              </div>
              <span className="text-sm text-muted-foreground font-mono ">
                Last updated 2 minutes ago
              </span>
            </CardContent>
          </Card>
          <Card className=" h-full">
            <CardContent className="flex items-center justify-center flex-col items-left h-full">
              <h3>Add Currency to Track</h3>
              <p>+</p>
            </CardContent>
          </Card>
          <Card className=" h-full">
            <CardContent className="flex items-center justify-center flex-col items-left h-full">
              <h3>Add Currency to Track</h3>
              <p>+</p>
            </CardContent>
          </Card>
          <Card className=" h-full">
            <CardContent className="flex items-center justify-center flex-col items-left h-full">
              <h3>Add Currency to Track</h3>
              <p>+</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-2 col-span-2 gap-4 ">
          {/* <h1>Transactions</h1> */}
          <Card>
            {" "}
            <CardHeader>
              <CardTitle>Execute Transaction</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-left">
              <SubmitTransaction />
            </CardContent>
          </Card>

          <Tabs defaultValue="account" className="  gap-4">
            <TabsList className="flex justify-between">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="revoked">Revoked</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="executed">Executed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-04-15</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+1.23 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-12</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-0.56 ETH</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="outline">
                            Pending
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-08</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+5.00 LTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-05</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-2.00 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-04-15</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+1.23 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-12</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-0.56 ETH</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="outline">
                            Pending
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-08</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+5.00 LTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-05</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-2.00 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="revoked">
              <Card>
                <CardHeader>
                  <CardTitle>Revoked Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-04-15</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+1.23 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-12</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-0.56 ETH</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="outline">
                            Pending
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-08</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+5.00 LTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-05</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-2.00 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="confirmed">
              <Card>
                <CardHeader>
                  <CardTitle>Confirmed Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-04-15</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+1.23 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-12</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-0.56 ETH</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="outline">
                            Pending
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-08</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+5.00 LTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-05</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-2.00 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="executed">
              <Card>
                <CardHeader>
                  <CardTitle>Executed Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-04-15</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+1.23 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-12</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-0.56 ETH</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="outline">
                            Pending
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-08</TableCell>
                        <TableCell>Deposit</TableCell>
                        <TableCell>+5.00 LTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-05</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>-2.00 BTC</TableCell>
                        <TableCell>
                          <Badge className="text-xs" variant="secondary">
                            Confirmed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
