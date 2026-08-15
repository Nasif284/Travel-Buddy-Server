export function getCookie(
  cookieHeader: string,
  name: string,
): string | undefined {
  const cookies = cookieHeader.split(';');

  for (const item of cookies) {
    const [key, ...valueParts] = item.trim().split('=');

    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }

  return undefined;
}
