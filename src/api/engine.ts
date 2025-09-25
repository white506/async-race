import http from './http';

export interface EngineStatus {
  velocity: number;
  distance: number;
}

export async function startEngine(id: number): Promise<EngineStatus> {
  return http<EngineStatus>(`/engine?id=${id}&status=started`, {
    method: 'PATCH',
  });
}

export async function stopEngine(id: number): Promise<EngineStatus> {
  return http<EngineStatus>(`/engine?id=${id}&status=stopped`, {
    method: 'PATCH',
  });
}

export async function driveCar(id: number): Promise<{ success: boolean }> {
  return http<{ success: boolean }>(`/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  });
}
