export function sleep(ms = 500) {
  return new Promise((r) => setTimeout(r, ms));
}
