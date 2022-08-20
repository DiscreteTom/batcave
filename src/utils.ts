import * as chalk from "chalk";
import { PathMapping } from "./model";

/** Show error message if condition is false. */
export function must(condition: any, errMsg: string) {
  if (!condition) console.log(chalk.red(errMsg));
}
