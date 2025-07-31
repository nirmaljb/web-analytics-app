import { Kafka } from "kafkajs";
import { NextResponse } from "next/server";

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();
let producerConnected = false;

export async function POST(request: Request) {
    if(!producerConnected) {
        await producer.connect();
        producerConnected = true;
    }
    try {
        const body = await request.json();

        const message = await producer.send({
            topic: 'analytics-events',
            messages: [{ value: JSON.stringify(body) }],
        });

        console.log(message);
        return NextResponse.json({ message: 'Event received!' }, { status: 201 })
    }catch(reason) {
        const message = reason instanceof Error ? reason.message : 'Internal Server Error'
        return NextResponse.json({ message },{ status: 500 });
    }
}

process.on('SIGINT', async () => {
    await producer.disconnect();
    process.exit(0); 
});





