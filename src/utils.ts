import * as chalk from "chalk";
import { PathMapping } from "./model";

/** Show error message if condition is false. */
export function must(condition: any, errMsg: string) {
  if (!condition) console.log(chalk.red(errMsg));
}

/** Patch the parameter in-place to ensure the paths ends with `/`. */
export function ensureFolder(pm: PathMapping) {
  if (!pm.local.endsWith("/")) pm.local += "/";
  if (!pm.remote.endsWith("/")) pm.remote += "/";
}
