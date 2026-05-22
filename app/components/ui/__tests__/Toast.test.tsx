import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ToastContainer, useToastStore, toast } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('renders nothing when no toasts', () => {
    render(<ToastContainer />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows a success toast', () => {
    render(<ToastContainer />);
    act(() => toast.success('Shipment delivered!'));
    expect(screen.getByText('Shipment delivered!')).toBeInTheDocument();
  });

  it('shows an error toast', () => {
    render(<ToastContainer />);
    act(() => toast.error('Something failed'));
    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  it('dismisses toast on close button click', async () => {
    render(<ToastContainer />);
    act(() => toast.success('Dismiss me'));
    const closeBtn = screen.getByLabelText('Dismiss notification');
    await userEvent.click(closeBtn);
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    render(<ToastContainer />);
    act(() => toast.info('Info message'));
    const { container } = render(<ToastContainer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
