"use client";

import { DonutChart } from "@/components/donut-chart";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  {
    name: "Travel",
    amount: 6730,
    share: "32.1%",
    color: "bg-cyan-500 dark:bg-cyan-500",
  },
  {
    name: "IT & equipment",
    amount: 4120,
    share: "19.6%",
    color: "bg-blue-500 dark:bg-blue-500",
  },
  {
    name: "Training & development",
    amount: 3920,
    share: "18.6%",
    color: "bg-indigo-500 dark:bg-indigo-500",
  },
  {
    name: "Office supplies",
    amount: 3210,
    share: "15.3%",
    color: "bg-violet-500 dark:bg-violet-500",
  },
  {
    name: "Communication",
    amount: 3010,
    share: "14.3%",
    color: "bg-fuchsia-500 dark:bg-fuchsia",
  },
];

const currencyFormatter = (number: number) =>
  "$" + Intl.NumberFormat("us").format(number).toString();

export default function Example() {
  return (
    <div className="w-full h-full flex justify-center">
      <Tabs defaultValue="overall">
        <TabsList>
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="user">By User</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <Card className="sm:mx-auto sm:max-w-lg">
            <CardContent>
              <DonutChart
                className="mx-auto mt-8"
                data={data}
                category="name"
                value="amount"
                showLabel={true}
                valueFormatter={currencyFormatter}
                showTooltip={false}
                colors={["cyan", "blue", "violet", "fuchsia"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
