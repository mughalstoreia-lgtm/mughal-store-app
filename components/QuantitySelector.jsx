"use client";

export default function QuantitySelector({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };
  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-surface-border bg-surface-card">
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-content-sub transition hover:text-content-main disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-[2.5rem] text-center text-sm font-medium text-content-main">
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-content-sub transition hover:text-content-main disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
