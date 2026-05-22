import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Input, Checkbox, Switch } from '../FormFields';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input id="test" label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input id="test" label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('calls onChange handler', async () => {
    const handler = vi.fn();
    render(<Input id="test" label="Name" onChange={handler} />);
    await userEvent.type(screen.getByLabelText('Name'), 'Anushka');
    expect(handler).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Input id="test" label="Name" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Switch', () => {
  it('renders with label', () => {
    render(<Switch label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const handler = vi.fn();
    render(<Switch label="Toggle" checked={false} onChange={handler} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it('shows correct aria-checked state', () => {
    render(<Switch label="Toggle" checked={true} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox id="check" label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });
});
