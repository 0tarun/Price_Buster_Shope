import { Link, useParams } from 'react-router-dom';
import Products from '../components/Products';
import { categories } from '../data/products';

function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return (
      <section className="content-page">
        <div className="content-page__hero">
          <span className="eyebrow">Category</span>
          <h1>Not found</h1>
          <Link to="/" className="primary-button">
            Return home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="category-page">
      <div className="category-page__header">
        <div>
          <span className="eyebrow">Shop by category</span>
          <h1>{category.name}</h1>
        </div>
        <Link to="/" className="text-link">
          Explore all
        </Link>
      </div>
      <Products category={slug} />
    </section>
  );
}

export default CategoryPage;
