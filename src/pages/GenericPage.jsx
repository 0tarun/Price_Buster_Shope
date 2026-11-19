import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function GenericPage({ title, eyebrow, description, cta }) {
  return (
    <section className="content-page">
      <div className="content-page__hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {cta && (
          <Link to="/" className="primary-button">
            {cta}
            <ArrowRight size="1rem" strokeWidth={2} />
          </Link>
        )}
      </div>
    </section>
  );
}

export default GenericPage;
