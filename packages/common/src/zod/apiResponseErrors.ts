import { z } from 'zod/v4';

export const UnexpectedServerError = z.object({
  type: z.literal('UnexpectedServerError'),
});
export type UnexpectedServerError = z.infer<typeof UnexpectedServerError>;
