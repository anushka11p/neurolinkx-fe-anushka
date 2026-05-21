'use client';

import { forwardRef } from 'react';

const baseInput = [
  'w-full px-3 py-2 rounded-[var(--radius-md)]',
  'border border-[var(--color-border)]',
  'bg-[var(--color-bg)] text-[var(--color-text-primary)]',
  'text-[var(--font-size-sm)]',
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'placeholder:text-[var(--color-text-muted)]',
].join(' ');

// ── Label ────────────────────────────────────────────────────────────────────
export function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)] mb-1"
    >
      {children}
      {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
    </label>
  );
}

// ── Error Message ─────────────────────────────────────────────────────────────
export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[var(--color-danger)] text-[var(--font-size-xs)] mt-1">
      {message}
    </p>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, required, className = '', ...props }, ref) => (
    <div className="flex flex-col">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${baseInput} ${error ? 'border-[var(--color-danger)]' : ''} ${className}`}
        {...props}
      />
      <ErrorMessage message={error} />
    </div>
  )
);
Input.displayName = 'Input';

// ── Textarea ──────────────────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, required, className = '', ...props }, ref) => (
    <div className="flex flex-col">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        rows={4}
        className={`${baseInput} resize-y ${error ? 'border-[var(--color-danger)]' : ''} ${className}`}
        {...props}
      />
      <ErrorMessage message={error} />
    </div>
  )
);
Textarea.displayName = 'Textarea';

// ── Select ────────────────────────────────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, required, options, placeholder, className = '', ...props }, ref) => (
    <div className="flex flex-col">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <select
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={`${baseInput} ${error ? 'border-[var(--color-danger)]' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ErrorMessage message={error} />
    </div>
  )
);
Select.displayName = 'Select';

// ── Checkbox ──────────────────────────────────────────────────────────────────
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          className={`w-4 h-4 accent-[var(--color-primary)] cursor-pointer ${className}`}
          {...props}
        />
        <label
          htmlFor={id}
          className="text-[var(--font-size-sm)] text-[var(--color-text-primary)] cursor-pointer"
        >
          {label}
        </label>
      </div>
      <ErrorMessage message={error} />
    </div>
  )
);
Checkbox.displayName = 'Checkbox';

// ── Radio ─────────────────────────────────────────────────────────────────────
export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function RadioGroup({ name, label, options, value, onChange, error }: RadioGroupProps) {
  return (
    <div role="radiogroup" aria-labelledby={label ? `${name}-label` : undefined}>
      {label && (
        <p
          id={`${name}-label`}
          className="text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)] mb-2"
        >
          {label}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange?.(o.value)}
              className="accent-[var(--color-primary)]"
            />
            <span className="text-[var(--font-size-sm)] text-[var(--color-text-primary)]">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      <ErrorMessage message={error} />
    </div>
  );
}

// ── Switch ────────────────────────────────────────────────────────────────────
export interface SwitchProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export function Switch({ label, checked = false, onChange, disabled, id }: SwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={[
          'relative w-10 h-6 rounded-full transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-bg-tertiary)]',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
      <span className="text-[var(--font-size-sm)] text-[var(--color-text-primary)]">{label}</span>
    </label>
  );
}
