import { Express } from 'express';
import { routes } from '@repo/common/src/zod';
import si from 'systeminformation';
import { round } from '@arthurka/ts-utils';
import { CPUPercentage, DiskUsage, RAMUsage } from '@repo/common/src/brands';
import { urls } from '../urls';

const getCPU = async () => {
  const { avgLoad } = await si.currentLoad();

  return CPUPercentage(round(avgLoad, 2));
};
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
