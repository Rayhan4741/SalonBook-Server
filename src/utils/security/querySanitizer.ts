export function sanitizeMongoQuery(val: any): any {
  if (typeof val === 'string') return val.replace(/\$/g, '');
  if (typeof val === 'object' && val !== null) {
    const clean: Record<string, any> = {};
    for (const k of Object.keys(val)) {
      if (!k.startsWith('$')) clean[k] = sanitizeMongoQuery(val[k]);
    }
    return clean;
  }
  return val;
}
