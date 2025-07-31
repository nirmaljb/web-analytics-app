import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'analytics-consumers' });
const prisma: PrismaClient = new PrismaClient();

async function consume() {
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: 'analytics-events', fromBeginning: true });
        
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    if(message.value) {
                        const parsedData: { type: string, url: string } = JSON.parse(message.value.toString());
                        await prisma.analyticsEvent.create({
                            data: {
                                ...parsedData
                            }
                        })
                    }
                }catch(error) {
                    throw new Error("INVALID FORMAT OF DATA (NON-JSON)");
                }
                console.log({
                    value: message.value && message.value.toString(),
                })
            },
        })
    }catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Caught an error:", error.message);
        } else {
            console.error("An unknown error occurred:", error);
        }
    }
}
consume();