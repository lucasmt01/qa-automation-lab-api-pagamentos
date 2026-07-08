import { Request, Response } from 'express';
import { cleanupPaymentsByTestRunId } from '../services/payments.service';

export async function deletePaymentsByTestRunIdController(req: Request, res: Response) {
  const { testRunId } = req.query;

  if (!testRunId || typeof testRunId !== 'string') {
    return res.status(400).json({
      code: 'INVALID_TEST_RUN_ID',
      message: 'O parâmetro testRunId é obrigatório'
    });
  }

  const result = await cleanupPaymentsByTestRunId(testRunId);

  return res.status(200).json({
    message: 'Massa de teste expurgada com sucesso',
    testRunId: result.testRunId,
    deletedCount: result.deletedCount
  });
}