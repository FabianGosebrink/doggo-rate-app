export function getFilename(environment: string, extension: string): string {
  return `${
    new Date().toISOString().split('T')[0]
  }-${environment}-${Math.random().toString(36).slice(2, 7)}${extension}`;
}
