import { Express } from 'express';
import { mountStats } from './stats';

export const mountRouter = (app: Express) => {
  mountStats(app);
};
