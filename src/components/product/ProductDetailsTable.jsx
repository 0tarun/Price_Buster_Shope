export function ProductDetailsTable({ details }) {
  const rows = Object.entries(details || {});

  return (
    <dl className="product-details-table">
      {rows.map(([label, value]) => (
        <div key={label} className="product-details-table__row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default ProductDetailsTable;
