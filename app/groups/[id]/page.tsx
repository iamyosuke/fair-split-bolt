import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ExpenseList } from "@/components/expense-list";
import { SettlementSummary } from "@/components/settlement-summary";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getGroupData(id: string) {
  // First, get the group and its members
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select(`
      *,
      members (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();

  if (groupError) throw groupError;
  if (!group) notFound();

  // Then, get the expenses with their payers and participants
  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select(`
      id,
      description,
      amount,
      created_at,
      payer_id,
      members!expenses_payer_id_fkey (
        id,
        name
      ),
      expense_participants (
        member_id,
        share_amount
      )
    `)
    .eq("group_id", id);

  if (expensesError) throw expensesError;

  return {
    ...group,
    expenses: expenses || [],
  };
}

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const group = await getGroupData(params.id);

  // Calculate totals for each member
  const memberTotals = group.members.reduce((acc: any, member: any) => {
    acc[member.id] = {
      name: member.name,
      paid: 0,
      owes: 0,
    };
    return acc;
  }, {});

  // Calculate what each member paid and owes
  group.expenses.forEach((expense: any) => {
    // Add to paid amount for payer
    memberTotals[expense.payer_id].paid += expense.amount;

    // Calculate shares
    expense.expense_participants.forEach((participant: any) => {
      memberTotals[participant.member_id].owes += participant.share_amount;
    });
  });

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <Link href={`/groups/${params.id}/expenses/new`}>
            <Button>Add Expense</Button>
          </Link>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
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
                          Paid: {formatCurrency(member.paid, group.currency)}
                        </div>
                        <div>
                          Owes: {formatCurrency(member.owes, group.currency)}
                        </div>
                        <div className="font-medium">
                          Balance:{" "}
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