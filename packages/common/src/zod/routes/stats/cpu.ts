import { z } from 'zod/v4';
import { makeRouteResponse } from '../../common';
import { UnexpectedServerError } from '../../apiResponseErrors';
import { customCPUPercentage } from '../../customs';

export const CPU = customCPUPercentage;

export const RouteResponse = makeRouteResponse(
  UnexpectedServerError,
  CPU,
);
export type RouteResponse = z.infer<typeof RouteResponse>;
