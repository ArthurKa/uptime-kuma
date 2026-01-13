import { z } from 'zod/v4';
import { makeRouteResponse } from '../../common';
import { UnexpectedServerError } from '../../apiResponseErrors';
import { customFileSizeGB } from '../../customs';

export const MaxLogsSize = customFileSizeGB;

export const RouteResponse = makeRouteResponse(
  UnexpectedServerError,
  MaxLogsSize,
);
export type RouteResponse = z.infer<typeof RouteResponse>;
