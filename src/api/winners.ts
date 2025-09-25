import http from './http';

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export async function getWinners(
  page: number,
  limit: number,
): Promise<Winner[]> {
  return http<Winner[]>(`/winners?_page=${page}&_limit=${limit}`);
}

export async function createWinner(
  id: number,
  wins: number,
  time: number,
): Promise<Winner> {
  return http<Winner>('/winners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });
}

export async function deleteWinner(id: number): Promise<void> {
  await http<void>(`/winners/${id}`, { method: 'DELETE' });
}

export async function updateWinner(
  id: number,
  wins: number,
  time: number,
): Promise<Winner> {
  return http<Winner>(`/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
}
