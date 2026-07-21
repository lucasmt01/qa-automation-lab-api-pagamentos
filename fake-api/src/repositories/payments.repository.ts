import { Collection } from 'mongodb';
import { getDatabase } from '../config/database';
import { Payment, PaymentStatus, PaymentStatusHistory } from '../models/payment.model';

const COLLECTION_NAME = 'payments';

async function getPaymentsCollection(): Promise<Collection<Payment>> {
  const database = await getDatabase();
  return database.collection<Payment>(COLLECTION_NAME);
}

export async function createPayment(payment: Payment): Promise<Payment> {
  const collection = await getPaymentsCollection();

  await collection.insertOne({ ...payment });

  return payment;
}

export async function findPaymentsByTestRunId(testRunId: string): Promise<Payment[]> {
  const collection = await getPaymentsCollection();

  const payments = await collection
    .find(
      { testRunId },
      {
        projection: {
          _id: 0
        }
      }
    )
    .sort({ createdAt: -1 })
    .toArray();

  return payments;
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

export async function updatePaymentStatusById(id: string, status: PaymentStatus, statusHistoryItem: PaymentStatusHistory, updatedAt: string): Promise<Payment | null> {
  const collection = await getPaymentsCollection();

  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        status,
        updatedAt
      },
      $push: {
        statusHistory: statusHistoryItem
      }
    },
    {
      returnDocument: 'after',
      projection: {
        _id: 0
      }
    }
  );

  return result;
}