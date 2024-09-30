import amqplib from "amqplib";

const QUEUE = "tasks";
let channel = null;

(async () => {
    try {
        const connection = await amqplib.connect("amqps://hnrqckmd:ftvzVDT-i3Zg2eCzwnl3ctPKIvb5CP4U@prawn.rmq.cloudamqp.com/hnrqckmd");
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, {
            durable: true
        });
    }
    catch (error) {
        console.log("Error", error);
    }
})();

export function send(message) {
    if (!channel) {
        throw new Error("Channel does not exist");
    }

    channel.sendToQueue(QUEUE, Buffer.from(message), {
        persistent: true,
    });
}