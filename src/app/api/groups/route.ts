import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.group.findMany();
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const group = await prisma.group.create({
      data: {
        name: body.name,
        members: body.members,
        currency: body.currency,
      },
    });
    return NextResponse.json(group);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}