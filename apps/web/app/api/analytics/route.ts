import { prisma } from "@/lib/prisma";
import client from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(Request: Request) {
    try {

        let data = await client.get('analytics-data');
        if(data) {
            data = JSON.parse(data);
            return NextResponse.json(data);
        }
        
        const analytics = await prisma.analyticsEvent.findMany({});
        const jsonString = JSON.stringify(analytics);

        await client.set('analytics-data', jsonString);
        await client.expire('analytics-data', 300);

        return NextResponse.json(analytics);
    }catch(err) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}