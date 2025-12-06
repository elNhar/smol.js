import type { Meta, StoryObj } from '@storybook/web-components';
import './counter-component';
import { html } from 'lit-html';

const meta: Meta = {
    title: 'Components/CounterComponent',
    component: 'counter-component',
    tags: ['autodocs'],
    argTypes: {
        initialCount: {
            control: 'number',
            description: 'Initial count value'
        },
        onIncrement: { action: 'increment' },
        onDecrement: { action: 'decrement' },
        onReset: { action: 'reset' }
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => html`<counter-component></counter-component>`
};

export const WithInitialValue: Story = {
    render: () => html`<counter-component initial-count="10"></counter-component>`
};

export const StartingAtHundred: Story = {
    render: () => html`<counter-component initial-count="100"></counter-component>`
};
