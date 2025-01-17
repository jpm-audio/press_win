export default async function waitForTime(time: number = 16): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, time));
}
