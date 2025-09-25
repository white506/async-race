import http from './http';

export interface Car {
  id: number;
  name: string;
  color: string;
}

export async function getCars(page: number, limit: number): Promise<Car[]> {
  return http<Car[]>(`/garage?_page=${page}&_limit=${limit}`);
}

export async function createCar(name: string, color: string): Promise<Car> {
  return http<Car>('/garage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}

export async function deleteCar(id: number): Promise<void> {
  await http<void>(`/garage/${id}`, { method: 'DELETE' });
}

export async function updateCar(
  id: number,
  name: string,
  color: string,
): Promise<Car> {
  return http<Car>(`/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}
