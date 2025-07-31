import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
})

const consumer = kafka.consumer({ groupId: 'analytics-consumers' })

async function consume() {
    await consumer.connect()
    await consumer.subscribe({ topic: 'analytics-events', fromBeginning: true })
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value && message.value.toString(),
            })
        },
    })
}

consume();