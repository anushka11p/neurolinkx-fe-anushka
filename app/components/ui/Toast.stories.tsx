import type { Meta, StoryObj } from '@storybook/nextjs';
import { ToastContainer, toast } from './Toast';
import Button from './Button';

const meta: Meta = {
  title: 'UI/Toast',
  component: ToastContainer,
  decorators: [
    (Story) => (
      <div className="h-64 relative">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-4">
      <Button onClick={() => toast.success('Shipment delivered successfully!')}>Success</Button>
      <Button variant="danger" onClick={() => toast.error('Failed to update status.')}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast.warning('Connection is slow.')}>
        Warning
      </Button>
      <Button variant="ghost" onClick={() => toast.info('New shipment assigned.')}>
        Info
      </Button>
      <ToastContainer />
    </div>
  ),
};
