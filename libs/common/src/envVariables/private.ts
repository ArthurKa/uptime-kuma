import assert from 'assert';
import { z, ZodError } from 'zod/v4';

const Envs = z.object({});
type Envs = z.infer<typeof Envs>;

let envs: Envs;

try {
  // eslint-disable-next-line no-process-env
  envs = Envs.parse(process.env);
} catch(e) {
  assert(e instanceof ZodError, 'This should never happen. |81x6rn|');

  console.error('.env Zod issues:', e.issues);
  throw e;
}

void envs;
