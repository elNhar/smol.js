import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import './example-button';

const meta: Meta = {
  title: 'Components/ExampleButton',
  component: 'example-button',
  tags: ['autodocs'],
  argTypes: { onClick: { action: 'click' } }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<example-button>Click me</example-button>`
};

export const CustomText: Story = {
  render: () => html`<example-button>Custom Button</example-button>`
};
