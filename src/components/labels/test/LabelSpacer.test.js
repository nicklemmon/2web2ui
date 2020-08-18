import React from 'react';
import { render } from '@testing-library/react';
import { useHibana } from 'src/context/HibanaContext';
import LabelSpacer from '../LabelSpacer';

jest.mock('src/context/HibanaContext');

describe('LabelSpacer', () => {
  it('does not render any passed in props and renders with content hidden from screen reader users', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const { container } = render(<LabelSpacer id="my-id" />);

    const elById = container.querySelector('#my-id');
    const el = container.querySelector('[aria-hidden="true"]');
    expect(elById).not.toBeTruthy();
    expect(el).toBeInTheDocument();
  });
});
