import config from "./config";

let concurrent = 0;

export default {
  async lock() {
    while (concurrent >= config.concurrent.limit) {
      await new Promise((resolve) =>
        setTimeout(resolve, config.concurrent.interval)
      );
    }
    concurrent++;
  },
  unlock() {
    concurrent--;
  },
};
