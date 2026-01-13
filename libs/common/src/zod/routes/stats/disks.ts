import { z } from 'zod/v4';
import { makeRouteResponse } from '../../common';
import { UnexpectedServerError } from '../../apiResponseErrors';
import { customDiskUsage } from '../../customs';

export const Disks = z.array(customDiskUsage);

export const RouteResponse = makeRouteResponse(
  UnexpectedServerError,
  Disks,
);
export type RouteResponse = z.infer<typeof RouteResponse>;
