import config from "./config";

let concurrent = 0;

async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Call f if the concurrent limit is not exceeded. */
export async function lock(f: () => Promise<void>) {
  while (concurrent >= config.transfer.concurrent.limit)
    await sleep(config.transfer.concurrent.interval);

  concurrent++;
  await f();
  concurrent--;
}
