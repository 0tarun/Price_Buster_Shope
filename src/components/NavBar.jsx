import { useState } from 'react';
import { ChevronRight, Menu, Search } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { categories } from '../data/products';
import './NavBar.css';

const navLinks = [
  { label: 'New arrivals', to: '/new' },
  { label: "Today's deals", to: '/deals' },
  { label: 'Help & support', to: '/help' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) {
      navigate('/search');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__category-wrap">
          <button type="button" className="navbar__category-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle categories menu">
            <Menu size="1.25rem" strokeWidth={1.8} />
            <span>All categories</span>
          </button>

          {menuOpen ? (
            <div className="navbar__dropdown" aria-label="Departments menu">
              {categories.map(({ slug, name }) => (
                <Link key={slug} to={`/category/${slug}`} className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>
                  <span>{name}</span>
                  <ChevronRight size="0.875rem" strokeWidth={2} />
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <form className="navbar__search" onSubmit={handleSubmit}>
          <Search size="1.25rem" strokeWidth={1.8} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for something you'll love..."
            aria-label="Search products"
          />
        </form>

        <div className="navbar__links">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
