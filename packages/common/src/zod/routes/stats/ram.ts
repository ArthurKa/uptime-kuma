import { z } from 'zod/v4';
import { makeRouteResponse } from '../../common';
import { UnexpectedServerError } from '../../apiResponseErrors';
import { customRAMUsage } from '../../customs';

export const RAM = customRAMUsage;

export const RouteResponse = makeRouteResponse(
  UnexpectedServerError,
  RAM,
);
export type RouteResponse = z.infer<typeof RouteResponse>;
