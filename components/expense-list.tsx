"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

type Expense = {
  id: string;
  description: string;
  amount: number;
  created_at: string;
  members: {
    name: string;
  };
};

type ExpenseListProps = {
  expenses: Expense[];
  currency: string;
};

export function ExpenseList({ expenses, currency }: ExpenseListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>All expenses in this group</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Paid by</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.members.name}</TableCell>
                <TableCell>{formatDate(expense.created_at)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(expense.amount, currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}