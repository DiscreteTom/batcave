import * as chalk from "chalk";

export function must(condition: any, errMsg: string) {
  if (!condition) console.log(chalk.red(errMsg));
}
