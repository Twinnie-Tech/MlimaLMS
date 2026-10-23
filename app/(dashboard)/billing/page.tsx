import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, CreditCard } from "lucide-react";

import { payments } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MpesaDialog } from "@/components/dashboard/mpesa-dialog";
import { PageTitle } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Billing" };

const packages = [
  { name: "Learner", price: "KSh 750", period: "month", features: ["Live classes", "Recorded lessons", "Revision papers", "Full child report"] },
  { name: "Learner · Termly", price: "KSh 2,000", period: "term", features: ["Everything in Learner", "Save KSh 250 per term"] },
  { name: "Languages", price: "KSh 1,500", period: "month", features: ["2 live classes a week", "Certificates"] },
];

export default function BillingPage() {
  return (
    <>
      <PageTitle title="Billing" description="Manage packages, renew subscriptions and view payments." />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 bg-linear-to-br from-green-600 to-emerald-700 p-6 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-green-100">Current package</p>
            <p className="mt-1 text-2xl font-bold">Learner · KSh 750 / month</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-green-50">
              <CalendarClock className="size-4" />
              Renews on 1 November 2026 for Amani Wambui
            </p>
          </div>
          <div className="w-full md:w-56">
            <MpesaDialog plan="Learner package" amount="KSh 750" label="Renew now" />
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold">Learning packages</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {packages.map((item) => (
            <Card key={item.name}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">{item.price}</span> / {item.period}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2 text-sm">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <MpesaDialog plan={item.name} amount={item.price} label="Subscribe" variant="outline" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-green-600" />
            Payment history
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right">{payment.amount}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-green-600/10 text-green-700 dark:text-green-400">{payment.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
