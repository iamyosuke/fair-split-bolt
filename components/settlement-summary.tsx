"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type MemberTotal = {
  name: string;
  paid: number;
  owes: number;
};

type SettlementSummaryProps = {
  memberTotals: Record<string, MemberTotal>;
  currency: string;
};

export function SettlementSummary({
  memberTotals,
  currency,
}: SettlementSummaryProps) {
  // Calculate who needs to pay whom
  const settlements = calculateSettlements(memberTotals);

  return (
    <div className="bg-secondary/50 rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Settlement Plan</h3>
      <div className="space-y-2">
        {settlements.map((settlement, index) => (
          <div key={index} className="text-sm">
            <strong>{settlement.from}</strong> pays{" "}
            <strong>{formatCurrency(settlement.amount, currency)}</strong> to{" "}
            <strong>{settlement.to}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateSettlements(memberTotals: Record<string, MemberTotal>) {
  const settlements = [];
  const members = Object.values(memberTotals);

  // Calculate net amounts (positive means they're owed money, negative means they owe)
  const netAmounts = members.map((member) => ({
    name: member.name,
    amount: member.paid - member.owes,
  }));

  // Sort by amount (descending)
  netAmounts.sort((a, b) => b.amount - a.amount);

  let i = 0; // index for people who are owed money (positive amounts)
  let j = netAmounts.length - 1; // index for people who owe money (negative amounts)

  while (i < j) {
    const creditor = netAmounts[i];
    const debtor = netAmounts[j];

    if (creditor.amount <= 0 || debtor.amount >= 0) break;

    const amount = Math.min(creditor.amount, -debtor.amount);
    
    if (amount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount,
      });
    }

    creditor.amount -= amount;
    debtor.amount += amount;

    if (creditor.amount === 0) i++;
    if (debtor.amount === 0) j--;
  }

  return settlements;
}