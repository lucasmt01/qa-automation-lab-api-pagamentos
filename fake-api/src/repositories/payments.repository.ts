import { Collection } from 'mongodb';
import { getDatabase } from '../config/database';
import { Payment } from '../models/payment.model';

const COLLECTION_NAME = 'payments';

async function getPaymentsCollection(): Promise<Collection<Payment>> {
  const database = await getDatabase();
  return database.collection<Payment>(COLLECTION_NAME);
}

export async function createPayment(payment: Payment): Promise<Payment> {
  const collection = await getPaymentsCollection();

  await collection.insertOne(payment);

  return payment;
}

export async function findPaymentById(id: string): Promise<Payment | null> {
  const collection = await getPaymentsCollection();

  const payment = await collection.findOne(
    { id },
    {
      projection: {
        _id: 0
      }
    }
  );

  return payment;
}

export async function deletePaymentsByTestRunId(testRunId: string): Promise<number> {
  const collection = await getPaymentsCollection();

  const result = await collection.deleteMany({
    testRunId
  });

  return result.deletedCount;
}