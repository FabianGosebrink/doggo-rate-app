export function getFilename(environment: string, extension: string): string {
  return `${
    new Date().toISOString().split('T')[0]
  }-${environment}-${Math.random().toString(36).slice(2, 7)}${extension}`;
}

export function urlToFile(url: string, filename: string): File {
  const arr = url.split(',');
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: 'image/png' });
}
