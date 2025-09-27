import { Link, Outlet } from 'react-router-dom';
import './Layout.scss';

function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1 className="layout__title">Async-Race</h1>
        <nav className="layout__nav">
          <Link to="/garage" className="layout__nav-link btn btn--16">
            Garage
          </Link>
          <Link to="/winners" className="layout__nav-link btn btn--16">
            Winners
          </Link>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
