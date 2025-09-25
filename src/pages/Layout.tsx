import { Link, Outlet } from 'react-router-dom';
import './Layout.scss';

function Layout() {
  return (
    <div className="layout">
      <nav className="nav">
        <Link to="/garage" className="nav__link">
          Garage
        </Link>
        <Link to="/winners" className="nav__link">
          Winners
        </Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
