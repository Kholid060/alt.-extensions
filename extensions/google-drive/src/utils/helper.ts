export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function getFileLink(
  type: 'drive' | 'google-docs' | 'google-sheets',
  fileId: string,
) {
  switch (type) {
    case 'drive':
      return `https://drive.google.com/file/d/${fileId}/view`;
    case 'google-docs':
      return `https://docs.google.com/document/d/${fileId}`;
    case 'google-sheets':
      return `https://docs.google.com/spreadsheets/d/${fileId}`;
    default:
      throw new Error(`"${type}" is invalid type`);
  }
}
