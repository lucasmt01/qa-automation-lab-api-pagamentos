import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z
    .number({
      error: 'O campo amount deve ser numérico'
    })
    .refine((value) => value > 0, {
      message: 'O campo amount deve ser maior que zero'
    }),

  currency: z.enum(['BRL'], {
    error: 'O campo currency deve ser BRL'
  }),

  paymentMethod: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD'], {
    error: 'O campo paymentMethod deve ser PIX, BOLETO ou CREDIT_CARD'
  }),

  customerDocument: z
    .string({
      error: 'O campo customerDocument é obrigatório'
    })
    .min(1, 'O campo customerDocument é obrigatório'),

  description: z.string().optional(),

  testRunId: z
    .string({
      error: 'O campo testRunId é obrigatório'
    })
    .min(1, 'O campo testRunId é obrigatório')
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REFUSED'], {
    error: 'O campo status deve ser APPROVED ou REFUSED'
  }),

  reason: z.string().optional()
});

export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;

export const cancelPaymentSchema = z.object({
  reason: z.string().optional()
});

export type CancelPaymentInput = z.infer<typeof cancelPaymentSchema>;