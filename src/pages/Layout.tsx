import { Link, Outlet } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import './Layout.scss';
import '@styles/global.scss';

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [menuOpen]);

  const handleNavBackground = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) setMenuOpen(false);
  };

  return (
    <div className={`layout ${menuOpen ? 'layout--menu-open' : ''}`}>
      <header className="layout__header">
        <h1 className="layout__title">Async-Race</h1>
        <button
          type="button"
          className={`layout__burger ${menuOpen ? 'layout__burger--active' : ''}`}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span className="layout__burger-bar" />
          <span className="layout__burger-bar" />
          <span className="layout__burger-bar" />
        </button>
        <div
          className="layout__nav"
          aria-hidden={!menuOpen}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="layout__nav-overlay"
            aria-label="Close menu"
            onClick={handleNavBackground}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMenuOpen(false);
            }}
          >
            <nav className="layout__nav-inner" aria-label="Main navigation">
              <Link
                to="/garage"
                className="layout__nav-link button--primary"
                onClick={handleNavClick}
              >
                Garage
              </Link>
              <Link
                to="/winners"
                className="layout__nav-link button--primary"
                onClick={handleNavClick}
              >
                Winners
              </Link>
            </nav>
          </button>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
