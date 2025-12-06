import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'smol.js';
import './example-component';

const meta: Meta = {
  title: 'Components/ExampleComponent',
  component: 'example-component',
  argTypes: {
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: [undefined, 'fancy'],
    },
  },
  render: (args) => html`
    <example-component
      title="${args.title || 'Hello World'}"
      variant="${args.variant || ''}"
    >
      ${args.content || 'Default slot content'}
    </example-component>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    title: 'Default Title',
    content: 'This is the default example',
  },
};

export const Fancy: Story = {
  args: {
    title: 'Fancy Title',
    variant: 'fancy',
    content: 'This is a fancy example with the variant prop',
  },
};
