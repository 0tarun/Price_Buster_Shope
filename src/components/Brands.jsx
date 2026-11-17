import './Brands.css';

const brandNames = ['BOTANIC', 'pure & kind', 'SONORA', 'living / well', 'NATURÉ', 'EVERYDAY'];

const Brands = () => {
  return (
    <section className="brands">
      <div className="brands__label">TRUSTED PARTNERS · BRANDS YOU LOVE</div>
      <div className="brands__row" aria-label="Trusted brands">
        {brandNames.map((brand) => (
          <span key={brand} className="brands__item">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Brands;
