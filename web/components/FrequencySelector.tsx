"use client";

import { Select } from "./Select";

export type Frequency = "30" | "60" | "120" | "custom";

export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "custom", label: "Custom" },
];

type Props = {
  id: string;
  value: Frequency;
  customMinutes: number;
  onChange: (value: Frequency) => void;
  onCustomChange: (minutes: number) => void;
  label?: string;
};

/** Frequency select plus the custom-minutes line that appears when needed. */
export function FrequencySelector({ id, value, customMinutes, onChange, onCustomChange, label = "Every" }: Props) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 min-h-7">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <Select id={id} value={value} onChange={(e) => onChange(e.target.value as Frequency)}>
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value} style={{ direction: "ltr" }}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>
      {value === "custom" && (
        <div className="flex items-center justify-end gap-3 min-h-7">
          <label htmlFor={`${id}-custom`} className="sr-only">
            Custom minutes
          </label>
          <span className="inline-flex items-baseline gap-2 text-ink-soft">
            <input
              id={`${id}-custom`}
              type="number"
              inputMode="numeric"
              min={5}
              max={720}
              step={5}
              value={customMinutes}
              onChange={(e) => onCustomChange(Math.min(720, Math.max(5, Number(e.target.value) || 5)))}
              aria-describedby={`${id}-custom-hint`}
              className="control-line w-16 text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span>minutes</span>
          </span>
        </div>
      )}
      {value === "custom" && (
        <p id={`${id}-custom-hint`} className="text-[0.75rem] text-ink-soft text-right -mt-2">
          Between 5 minutes and 12 hours.
        </p>
      )}
    </>
  );
}
