export async function probeHttpEndpoint(url: string): Promise<number> {
  const res = await fetch(url);
  return res.status;
}
