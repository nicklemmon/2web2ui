import React, { createContext } from 'react';
import { render, screen } from '@testing-library/react';
import useProvidedContext from './useProvidedContext';

const DemoContext = createContext();

function useDemoContext() {
  return useProvidedContext(DemoContext);
}

function ErrorThrowingComponent() {
  return (
    <>
      <ComponentUsingContext />

      <DemoContext.Provider></DemoContext.Provider>
    </>
  );
}

function WellBehavedComponent() {
  return (
    <DemoContext.Provider value={{ hello: 'world!' }}>
      <ComponentUsingContext />
    </DemoContext.Provider>
  );
}

function ComponentUsingContext() {
  const { hello } = useDemoContext();

  return <>{hello}</>;
}

describe('useProvidedContext', () => {
  it('throws a generic error when no displayName is set on the provided context', () => {
    expect(() => render(<ErrorThrowingComponent />)).toThrowError(
      'Passed in context must be used within a relevant provider.',
    );
  });

  it('throws an error with a relevant display name when set on the provided context', () => {
    DemoContext.displayName = 'DemoContext';

    expect(() => render(<ErrorThrowingComponent />)).toThrowError(
      'DemoContext must be used within a DemoContext.Provider.',
    );
  });

  it('returns the provided context when used within the relevant context provider', () => {
    render(<WellBehavedComponent />);

    expect(screen.getByText('world!')).toBeInTheDocument();
  });
});
