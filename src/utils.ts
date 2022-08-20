/** Show error message if condition is false. */
export function must(condition: any, errMsg: string) {
  if (!condition) throw errMsg;
}
