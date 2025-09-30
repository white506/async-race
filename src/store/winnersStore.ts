import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  getWinners,
  createWinner,
  updateWinner,
  deleteWinner,
  Winner,
} from '@api/winners';

export enum SortBy {
  Id = 'id',
  Wins = 'wins',
  Time = 'time',
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

interface WinnersState {
  winners: Winner[];
  page: number;
  total: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  loading: boolean;

  setWinners: (winners: Winner[]) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setSorting: (sortBy: SortBy, sortOrder: SortOrder) => void;
  setLoading: (loading: boolean) => void;

  fetchWinners: (
    page: number,
    limit: number,
    sortBy?: SortBy,
    order?: SortOrder,
  ) => Promise<void>;
  saveWinner: (id: number, time: number) => Promise<void>;
  removeWinner: (id: number) => Promise<void>;
}

export const useWinnersStore = create<WinnersState>()(
  devtools(
    persist(
      (set, get) => ({
        winners: [],
        page: 1,
        total: 0,
        sortBy: SortBy.Id,
        sortOrder: SortOrder.Asc,
        loading: false,

        setWinners: (winners: Winner[]) => set({ winners }),
        setPage: (page: number) => set({ page }),
        setTotal: (total: number) => set({ total }),
        setSorting: (sortBy: SortBy, sortOrder: SortOrder) =>
          set({ sortBy, sortOrder }),
        setLoading: (loading: boolean) => set({ loading }),

        fetchWinners: async (
          page: number,
          limit: number,
          sortBy?: SortBy,
          order?: SortOrder,
        ) => {
          const { setLoading, setWinners, setTotal } = get();
          setLoading(true);

          try {
            const currentSortBy = sortBy || get().sortBy;
            const currentOrder = order || get().sortOrder;

            const winners = await getWinners(page, limit);

            const sortedWinners = [...winners].sort((a, b) => {
              if (currentSortBy === SortBy.Wins) {
                return currentOrder === SortOrder.Asc
                  ? a.wins - b.wins
                  : b.wins - a.wins;
              }

              if (currentSortBy === SortBy.Time) {
                return currentOrder === SortOrder.Asc
                  ? a.time - b.time
                  : b.time - a.time;
              }

              return currentOrder === SortOrder.Asc ? a.id - b.id : b.id - a.id;
            });

            setWinners(sortedWinners);

            const response = await fetch('http://localhost:3000/winners');
            const allWinners = await response.json();
            setTotal(allWinners.length);
          } catch {
            // If there is an error loading the winners
          } finally {
            setLoading(false);
          }
        },
        saveWinner: async (id: number, time: number) => {
          const { fetchWinners, page, sortBy, sortOrder } = get();

          try {
            const response = await fetch(`http://localhost:3000/winners/${id}`);

            if (response.ok) {
              const existingWinner = (await response.json()) as Winner;

              await updateWinner(
                id,
                existingWinner.wins + 1,
                Math.min(existingWinner.time, time),
              );
            } else {
              await createWinner(id, 1, time);
            }

            await fetchWinners(page, 10, sortBy, sortOrder);
          } catch {
            // If there is an error saving the winner
          }
        },
        removeWinner: async (id: number) => {
          const { fetchWinners, page, sortBy, sortOrder } = get();

          try {
            await deleteWinner(id);

            await fetchWinners(page, 10, sortBy, sortOrder);
          } catch {
            // If there is an error deleting the winner
          }
        },
      }),
      {
        name: 'winners-storage',

        partialize: (state) => ({
          winners: state.winners,
          page: state.page,
          total: state.total,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      },
    ),
  ),
);
