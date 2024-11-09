import amqp from 'amqplib';

class RabbitMQService {
  private channel: amqp.Channel | null = null;

  constructor() {
    this.initialize(); // Automatically initialize on import
  }

  private async initialize() {
    if (!this.channel) {
      try {
        const connection = await amqp.connect('amqp://localhost');
        this.channel = await connection.createChannel();
        await this.channel.assertQueue('userRegistrationQueue', { durable: true });
        console.log("RabbitMQ connected and channel created");
      } catch (error) {
        console.error("Failed to initialize RabbitMQ:", error);
      }
    }
  }

  public async sendToQueue(queueName: string, message: any) {
    if (!this.channel) throw new Error("RabbitMQ channel is not initialized");
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log("Message sent to RabbitMQ");
  }
}

// Export a single instance that initializes itself
export default new RabbitMQService();
