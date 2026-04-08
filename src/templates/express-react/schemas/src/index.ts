import { z } from 'zod';

const CreateItemInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
export type CreateItemInput = z.infer<typeof CreateItemInputSchema>;
export { CreateItemInputSchema as CreateItemInput };

const UpdateItemInputSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});
export type UpdateItemInput = z.infer<typeof UpdateItemInputSchema>;
export { UpdateItemInputSchema as UpdateItemInput };

const ItemResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ItemResponse = z.infer<typeof ItemResponseSchema>;
export { ItemResponseSchema as ItemResponse };
