import { useEffect, useCallback } from 'react';
import CarVisual from '../components/CarVisual';
import { useCarsStore, useWinnersStore, SortBy, SortOrder } from '../store';
import type { Winner } from '../api/winners';
import type { Car } from '../api/cars';
import '../styles/global.scss';
import './Winners.scss';

function Winners() {
  const winners = useWinnersStore((s) => s.winners);
  const page = useWinnersStore((s) => s.page);
  const total = useWinnersStore((s) => s.total);
  const sortBy = useWinnersStore((s) => s.sortBy);
  const sortOrder = useWinnersStore((s) => s.sortOrder);
  const setPage = useWinnersStore((s) => s.setPage);
  const setSorting = useWinnersStore((s) => s.setSorting);
  const fetchWinners = useWinnersStore((s) => s.fetchWinners);

  const cars = useCarsStore((s) => s.cars);
  const fetchCars = useCarsStore((s) => s.fetchCars);

  useEffect(() => {
    fetchWinners(page, 10, sortBy, sortOrder).catch(() => {});
  }, [page, sortBy, sortOrder, fetchWinners]);

  useEffect(() => {
    if (cars.length === 0) {
      fetchCars(1, 100).catch(() => {});
    }
  }, [cars.length, fetchCars]);

  const toggleSort = useCallback(
    (field: SortBy) => {
      if (sortBy === field) {
        setSorting(
          field,
          sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc,
        );
      } else {
        setSorting(field, SortOrder.Asc);
      }
    },
    [sortBy, sortOrder, setSorting],
  );

  const getCarInfo = useCallback(
    (id: number) => {
      const car = cars.find((c: Car) => c.id === id);
      return {
        name: car?.name || `Car #${id}`,
        color: car?.color || '#000000',
      };
    },
    [cars],
  );

  const getSortArrow = useCallback(
    (field: SortBy) => {
      if (sortBy !== field) return null;
      return sortOrder === SortOrder.Asc ? '↑' : '↓';
    },
    [sortBy, sortOrder],
  );

  return (
    <div className="winners">
      <h1 className="winners__title">Winners ({total})</h1>
      <p className="winners__page">Page {page}</p>

      <table className="winners-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Car</th>
            <th>Name</th>
            <th className="sortable" onClick={() => toggleSort(SortBy.Wins)}>
              Wins {getSortArrow(SortBy.Wins)}
            </th>
            <th className="sortable" onClick={() => toggleSort(SortBy.Time)}>
              Best time (seconds) {getSortArrow(SortBy.Time)}
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner: Winner, index: number) => {
            const { name, color } = getCarInfo(winner.id);
            return (
              <tr key={winner.id}>
                <td>{(page - 1) * 10 + index + 1}</td>
                <td className="car-cell">
                  <div className="car-container">
                    <CarVisual
                      id={winner.id}
                      color={color}
                      isRunning={false}
                      isBroken={false}
                      isFinished={false}
                    />
                  </div>
                </td>
                <td>{name}</td>
                <td>{winner.wins}</td>
                <td>{winner.time.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="winners__pagination">
        <button
          className="button--primary"
          type="button"
          disabled={page <= 1}
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          Prev
        </button>
        <button
          className="button--primary"
          type="button"
          disabled={page >= Math.ceil(total / 10)}
          onClick={() =>
            setPage(page < Math.ceil(total / 10) ? page + 1 : page)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Winners;
