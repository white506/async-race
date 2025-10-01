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
    fetchCars(1, 500).catch(() => {});
  }, [fetchCars]);

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

  const getSortArrowClass = useCallback(
    (field: SortBy) => {
      if (sortBy !== field) return '';
      return sortOrder === SortOrder.Asc
        ? 'winners__sort-asc'
        : 'winners__sort-desc';
    },
    [sortBy, sortOrder],
  );

  return (
    <div className="winners">
      <h1 className="winners__title">Winners ({total})</h1>
      <p className="winners__page">Page {page}</p>

      <table className="winners__table">
        <thead>
          <tr className="winners__row">
            <th className="winners__cell winners__cell--header">Number</th>
            <th className="winners__cell winners__cell--header">Car</th>
            <th className="winners__cell winners__cell--header">Name</th>
            <th
              className={`winners__cell winners__cell--header sortable ${getSortArrowClass(SortBy.Wins)}`}
              onClick={() => toggleSort(SortBy.Wins)}
            >
              Wins
            </th>
            <th
              className={`winners__cell winners__cell--header sortable ${getSortArrowClass(SortBy.Time)}`}
              onClick={() => toggleSort(SortBy.Time)}
            >
              Best time
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner: Winner, index: number) => {
            const { name, color } = getCarInfo(winner.id);
            return (
              <tr key={winner.id} className="winners__row">
                <td className="winners__cell">{(page - 1) * 10 + index + 1}</td>
                <td className="winners__cell winners__cell--car">
                  <div className="winners__car-container">
                    <CarVisual
                      id={winner.id}
                      color={color}
                      isRunning={false}
                      isBroken={false}
                      isFinished={false}
                    />
                  </div>
                </td>
                <td className="winners__cell">{name}</td>
                <td className="winners__cell">{winner.wins}</td>
                <td className="winners__cell">{winner.time.toFixed(2)}</td>
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
