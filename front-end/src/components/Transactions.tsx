import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { EditOutlined } from "@ant-design/icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

export const Transactions = () => {
  return (
    <Tabs defaultValue="all" className="h-full w-2/4">
      <TabsList className="flex justify-between">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="revoked">Revoked</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        <TabsTrigger value="executed">Executed</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="text" placeholder="Search..." />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Approvals</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-04-15 - 12:33 PM</TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>+1.23 BTC</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="secondary">
                      Deposit
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-04-12 - 03:31 AM</TableCell>
                  <TableCell>Transfer</TableCell>
                  <TableCell>
                    {" "}
                    <Badge className="text-xs">3 / 3</Badge>
                  </TableCell>
                  <TableCell>+1.23 BTC</TableCell>
                  <TableCell>
                    <Badge className="text-xs">Confirmed</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-04-08 - 17:23 PM</TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>-</TableCell>

                  <TableCell>+1.23 BTC</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="secondary">
                      Confirmed
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-04-05 - 10:12 AM</TableCell>
                  <TableCell>Transfer</TableCell>
                  <TableCell>
                    {" "}
                    <Badge className="text-xs" variant="outline">
                      2 / 3
                    </Badge>
                  </TableCell>
                  <TableCell>+1.23 BTC</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Pending
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
  );
};
