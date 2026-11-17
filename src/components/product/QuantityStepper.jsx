import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({ value, min = 1, max = 10, onChange }) {
  const clamp = (nextValue) => Math.min(max, Math.max(min, nextValue));

  return (
    <div className="quantity-stepper" aria-label="Quantity selector">
      <button
        type="button"
        className="quantity-stepper__button"
        aria-label="Decrease quantity"
        onClick={() => onChange(clamp(value - 1))}
      >
        <Minus size={14} strokeWidth={2} />
      </button>
      <span className="quantity-stepper__value">{value}</span>
      <button
        type="button"
        className="quantity-stepper__button"
        aria-label="Increase quantity"
        onClick={() => onChange(clamp(value + 1))}
      >
        <Plus size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export default QuantityStepper;
