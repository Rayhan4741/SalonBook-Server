export function inspectSecurityHeaders(headers: Record<string, any>) {
  return {
    hasAuth: !!headers['authorization'],
    hasContentType: !!headers['content-type'],
    hasIdempotencyKey: !!headers['idempotency-key'],
  };
}
