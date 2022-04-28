import config from "./config";

let concurrent = 0;

export default {
  async lock(f: () => Promise<void>) {
    while (concurrent >= config.concurrent.limit) {
      // sleep
      await new Promise((resolve) =>
        setTimeout(resolve, config.concurrent.interval)
      );
    }

    concurrent++;
    await f();
    concurrent--;
  },
};
