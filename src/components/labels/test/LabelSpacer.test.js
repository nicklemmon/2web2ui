import React from 'react';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import LabelSpacer from '../LabelSpacer';

describe('LabelSpacer', () => {
  it('renders with content hidden from screen reader users', () => {
    const { container } = render(
      <TestApp isHibanaEnabled={true}>
        <LabelSpacer />
      </TestApp>,
    );
    const el = container.querySelector('[aria-hidden="true"]');

    expect(el).toBeInTheDocument();
  });

  it('renders with the passed in `className`', () => {
    const { container } = render(
      <TestApp isHibanaEnabled={true}>
        <LabelSpacer className="hello-there" />
      </TestApp>,
    );
    const el = container.querySelector('.hello-there');

    expect(el).toBeInTheDocument();
  });
});
