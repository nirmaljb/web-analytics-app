import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(Request: Request) {
    const analytics = await prisma.analyticsEvent.findMany({});
    return NextResponse.json(analytics);
}