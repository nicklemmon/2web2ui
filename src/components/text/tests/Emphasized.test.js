import React from 'react';
import { render, screen } from '@testing-library/react';
import EmphasizedComponent from '../Emphasized';
import TestApp from 'src/__testHelpers__/TestApp';

// TODO: Remove when OG theme is removed - should be no need to wrap things in <TestApp>
function Emphasized(props) {
  return (
    <TestApp isHibanaEnabled={true}>
      <EmphasizedComponent {...props} />
    </TestApp>
  );
}

describe('Emphasized', () => {
  it('renders with passed in children', () => {
    render(<Emphasized>Hello, world.</Emphasized>);

    expect(screen.getByText('Hello, world.')).toBeInTheDocument();
  });

  it('renders with the passed in "data-id" prop value', () => {
    const { container } = render(<Emphasized data-id="foobar">Hello, world.</Emphasized>);
    const el = container.querySelector('[data-id="foobar"]');

    expect(el).toBeTruthy();
  });

  it('renders as the passed in "as" element', () => {
    render(<Emphasized as="h1">Hello, world.</Emphasized>);

    expect(screen.getByRole('heading', { name: 'Hello, world.' })).toBeInTheDocument();
  });
});
