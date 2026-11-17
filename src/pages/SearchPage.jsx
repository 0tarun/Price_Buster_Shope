import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Products from '../components/Products';
import { searchProducts } from '../services/api';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const resultsPromise = useMemo(() => searchProducts(query), [query]);

  return (
    <section className="search-page">
      <div className="search-page__header">
        <div>
          <span className="eyebrow">Search</span>
          <h1>{query ? `Results for “${query}”` : 'Search the shop'}</h1>
        </div>
        <Link to="/" className="text-link">
          Back home
        </Link>
      </div>

      <Products query={query} resultsPromise={resultsPromise} isSearch />
    </section>
  );
}

export default SearchPage;
