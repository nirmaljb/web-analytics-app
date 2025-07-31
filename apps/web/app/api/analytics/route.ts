import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient();
export async function GET(Request: Request) {
    const analytics = await prisma.analyticsEvent.findMany({});
    return NextResponse.json({ analytics });
}