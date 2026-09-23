import { z } from 'zod';
import { uuidSchema, displayCodeSchema } from './id.js';
import { DonationKind, TreasuryFundingSource } from '../enums.js';

export const atomicAmountSchema = z
  .string()
  .regex(/^[1-9][0-9]*$/, { message: 'Số tiền phải là số nguyên dương tính theo atomic units' });

export const calculateSplit = (amountStr: string) => {
  const amount = BigInt(amountStr);
  const projectAmount = amount / 5n; // 20%
  const authorAmount = amount - projectAmount; // 80%
  return {
    totalAmount: amount.toString(),
    projectAmount: projectAmount.toString(),
    authorAmount: authorAmount.toString()
  };
};

export const createDonationSchema = z.object({
  kind: z.nativeEnum(DonationKind),
  routeId: uuidSchema.optional(),
  amountAtomic: atomicAmountSchema,
  asset: z.string().min(1)
}).refine((data) => {
  if (data.kind === DonationKind.POST_TIP && !data.routeId) {
    return false;
  }
  return true;
}, {
  message: 'POST_TIP bắt buộc phải có routeId',
  path: ['routeId']
});

export const vipPlanSchema = z.object({
  planCode: z.literal('VIP_ANNUAL'),
  priceUsdCents: z.literal(1500),
  termMonths: z.literal(12)
});
