import React from 'react';
import { render, screen } from '@testing-library/react';
import UppercaseComponent from '../Uppercase';
import TestApp from 'src/__testHelpers__/TestApp';

// TODO: Remove when OG theme is removed - should be no need to wrap things in <TestApp>
function Uppercase(props) {
  return (
    <TestApp isHibanaEnabled={true}>
      <UppercaseComponent {...props} />
    </TestApp>
  );
}

describe('Uppercase', () => {
  it('renders with passed in children', () => {
    render(<Uppercase>Hello, world.</Uppercase>);

    expect(screen.getByText('Hello, world.')).toBeInTheDocument();
  });

  it('renders with the passed in "data-id" prop value', () => {
    const { container } = render(<Uppercase data-id="foobar">Hello, world.</Uppercase>);
    const el = container.querySelector('[data-id="foobar"]');

    expect(el).toBeTruthy();
  });

  it('renders as the passed in "as" element', () => {
    render(<Uppercase as="h1">Hello, world.</Uppercase>);

    expect(screen.getByRole('heading', { name: 'Hello, world.' })).toBeInTheDocument();
  });
});
