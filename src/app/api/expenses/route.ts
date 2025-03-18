import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const groupId = request.nextUrl.searchParams.get('groupId');
    const query = groupId 
      ? prisma.expense.findMany({ where: { group_id: groupId } })
      : prisma.expense.findMany();

    const expenses = await query;
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const expense = await prisma.expense.create({
      data: {
        group_id: body.group_id,
        amount: body.amount,
        description: body.description,
        payer: body.payer,
        participants: body.participants,
      },
    });
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}