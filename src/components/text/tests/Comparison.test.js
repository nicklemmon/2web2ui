import React from 'react';
import { render, screen } from '@testing-library/react';
import ComparisonComponent from '../Comparison';
import TestApp from 'src/__testHelpers__/TestApp';

// TODO: Remove when OG theme is removed - should be no need to wrap things in <TestApp>
function Comparison(props) {
  return (
    <TestApp isHibanaEnabled={true}>
      <ComparisonComponent {...props} />
    </TestApp>
  );
}

describe('Comparison', () => {
  it('renders with passed in children', () => {
    render(<Comparison>Hello, world.</Comparison>);

    expect(screen.getByText('Hello, world.')).toBeInTheDocument();
  });

  it('renders with the passed in "data-id" prop value', () => {
    const { container } = render(<Comparison data-id="foobar">Hello, world.</Comparison>);
    const el = container.querySelector('[data-id="foobar"]');

    expect(el).toBeTruthy();
  });

  it('renders as the passed in "as" element', () => {
    render(<Comparison as="h1">Hello, world.</Comparison>);

    expect(screen.getByRole('heading', { name: 'Hello, world.' })).toBeInTheDocument();
  });
});
