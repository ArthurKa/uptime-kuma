import { z } from 'zod/v4';
import { makeRouteResponse } from '../../common';
import { UnexpectedServerError } from '../../apiResponseErrors';
import { CPU } from './cpu';
import { Disks } from './disks';
import { RAM } from './ram';

export const RouteResponse = makeRouteResponse(
  UnexpectedServerError,
  z.object({
    cpu: CPU,
    ram: RAM,
    disks: Disks,
  }),
);
export type RouteResponse = z.infer<typeof RouteResponse>;
