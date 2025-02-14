"use client";

import { DonutChart } from "@/components/donut-chart";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

function Chart({ correct, incorrect }: { correct: number; incorrect: number }) {
  const data = [
    {
      name: "Correct",
      amount: correct,
    },
    {
      name: "Incorrect",
      amount: incorrect,
    },
  ];

  return (
    <Card className="sm:mx-auto sm:max-w-lg">
      <CardContent>
        <DonutChart
          className="mx-auto mt-8"
          data={data}
          category="name"
          value="amount"
          showTooltip={true}
          showLabel={true}
          colors={["cyan", "violet"]}
        />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Correct</TableCell>
              <TableCell>{correct}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Incorrect</TableCell>
              <TableCell>{incorrect}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Statistic({
  userCorrect,
  userIncorrect,
  overallCorrect,
  overallIncorrect,
}: {
  userCorrect: number;
  userIncorrect: number;
  overallCorrect: number;
  overallIncorrect: number;
}) {
  return (
    <div className="w-full h-full flex justify-center">
      <Tabs defaultValue="overall">
        <TabsList>
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="user">By User</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <Chart correct={overallCorrect} incorrect={overallIncorrect} />
        </TabsContent>
        <TabsContent value="user">
          <Chart correct={userCorrect} incorrect={userIncorrect} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
