import { Express } from 'express';
import { routes } from '@repo/common/src/zod';
import si from 'systeminformation';
import os from 'os';
import { getNotUndefined, round } from '@arthurka/ts-utils';
import { CPUPercentage, DiskUsage, RAMUsage } from '@repo/common/src/brands';
import assert from 'assert';
import { urls } from '../urls';

const getCPU = () => (
  new Promise<CPUPercentage>(res => {
    process.nextTick(() => {
      const avgFor1Min = getNotUndefined(os.loadavg()[0], 'This should never happen. |kkn3zd|');
      const { length } = os.cpus();
      assert(length > 0, 'Something went wrong. |8118t6|');

      res(CPUPercentage(round(avgFor1Min * 100 / length, 2)));
    });
  })
);
const getRAM = async () => {
  const { available } = await si.mem();

  return RAMUsage(round(available / 1024 ** 3, 2));
};
const getDisks = async () => {
  const disks = await si.fsSize();

  return disks.map(e => (
    DiskUsage(round(e.available / 1024 ** 3, 2))
  ));
};

export const mountStats = (app: Express) => {
  app.get<unknown, routes.stats._.RouteResponse>(urls.stats._, async (req, res) => {
    const [cpu, ram, disks] = await Promise.all([
      getCPU(),
      getRAM(),
      getDisks(),
    ]);

    res.json({
      success: true,
      data: {
        cpu,
        ram,
        disks,
      },
    });
  });

  app.get<unknown, routes.stats.cpu.RouteResponse>(urls.stats.cpu, async (req, res) => {
    res.json({
      success: true,
      data: await getCPU(),
    });
  });

  app.get<unknown, routes.stats.ram.RouteResponse>(urls.stats.ram, async (req, res) => {
    res.json({
      success: true,
      data: await getRAM(),
    });
  });

  app.get<unknown, routes.stats.disks.RouteResponse>(urls.stats.disks, async (req, res) => {
    res.json({
      success: true,
      data: await getDisks(),
    });
  });
};
