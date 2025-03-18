import { fetchGroup, fetchExpenses } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ExpenseList } from "@/components/expense-list";
import { SettlementSummary } from "@/components/settlement-summary";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getGroupData(id: string) {
  try {
    // First, get the group and its members
    const group = await fetchGroup(id);
    if (!group) notFound();

    // Then, get the expenses
    const expenses = await fetchExpenses(id);

    return {
      ...group,
      expenses: expenses || [],
    };
  } catch (error) {
    console.error('Error fetching group data:', error);
    throw error;
  }
}

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const t = await getTranslations("groupDetails");
  const group = await getGroupData(params.id);

  // Calculate totals for each member
  const memberTotals = group.members.reduce((acc: any, memberName: string) => {
    acc[memberName] = {
      name: memberName,
      paid: 0,
      owes: 0,
    };
    return acc;
  }, {});

  // Calculate what each member paid and owes
  group.expenses.forEach((expense: any) => {
    // Add to paid amount for payer
    memberTotals[expense.payer].paid += expense.amount;

    // Calculate shares
    const shareAmount = expense.amount / expense.participants.length;
    expense.participants.forEach((participantName: string) => {
      memberTotals[participantName].owes += shareAmount;
    });
  });

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <div className="flex space-x-4">
            <Link href={`/groups/${params.id}/expenses/new`}>
              <Button>{t("addExpense")}</Button>
            </Link>
            <Link href={`/groups/${params.id}/edit`}>
              <Button>{t("editGroup")}</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.values(memberTotals).map((member: any) => (
                    <div
                      key={member.name}
                      className="bg-secondary/50 rounded-lg p-4"
                    >
                      <div className="font-medium mb-2">{member.name}</div>
                      <div className="text-sm space-y-1">
                        <div>
                          {t("paid")}: {formatCurrency(member.paid, group.currency)}
                        </div>
                        <div>
                          {t("owes")}: {formatCurrency(member.owes, group.currency)}
                        </div>
                        <div className="font-medium">
                          {t("balance")}:{" "}
                          {formatCurrency(
                            member.paid - member.owes,
                            group.currency
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <SettlementSummary
                  memberTotals={memberTotals}
                  currency={group.currency}
                />
              </div>
            </CardContent>
          </Card>

          <ExpenseList expenses={group.expenses} currency={group.currency} />
        </div>
      </div>
    </div>
  );
}
