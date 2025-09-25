import BASE_URL from './config';

export default async function http<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
