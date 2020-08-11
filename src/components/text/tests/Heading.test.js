import React from 'react';
import { render } from '@testing-library/react';
import { OGHeading, HibanaHeading } from '../Heading';
import { useHibana } from 'src/context/HibanaContext';

jest.mock('src/context/HibanaContext');

describe('Heading', () => {
  const defaultProps = {
    as: 'h2',
    looksLike: 'h1',
    children: 'My Heading',
  };

  const hibanaSubject = props => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    return render(<HibanaHeading {...defaultProps} {...props} />);
  };

  const OGSubject = props => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    return render(<OGHeading {...defaultProps} {...props} />);
  };

  describe('with Hibana enabled', () => {
    it('renders the passed in heading level controlled via the "as" prop', () => {
      const { container } = hibanaSubject();

      const headingEl = container.querySelector('h1');

      expect(headingEl).toBeTruthy();
    });

    it('renders the heading element directly controlled via the "as" prop', () => {
      const { container, queryByRole } = hibanaSubject();

      const headingEl = container.querySelector('[aria-level="2"]');

      expect(queryByRole('heading')).toBeInTheDocument();
      expect(headingEl).toBeTruthy();
    });

    it('renders with passed in className', () => {
      const { container } = hibanaSubject({ className: 'my-class' });

      const headingEl = container.querySelector('.my-class');

      expect(headingEl).toBeTruthy();
    });

    it('renders with passed in children', () => {
      const { queryByText } = hibanaSubject();

      expect(queryByText('My Heading')).toBeInTheDocument();
    });

    it('renders with the passed in "data-id"', () => {
      const { container } = hibanaSubject({ 'data-id': 'my-id' });

      const headingEl = container.querySelector('[data-id="my-id"]');

      expect(headingEl).toBeTruthy();
    });

    it('renders with the passed in "id"', () => {
      const { container } = hibanaSubject({ id: 'my-id' });

      const headingEl = container.querySelector('#my-id');

      expect(headingEl).toBeTruthy();
    });
  });

  describe('with Hibana disabled', () => {
    it('renders the passed in heading level controlled via the "as" prop', () => {
      const { container } = OGSubject();

      const headingEl = container.querySelector('h1');

      expect(headingEl).toBeTruthy();
    });

    it('renders the heading element directly controlled via the "as" prop', () => {
      const { container, queryByRole } = OGSubject();

      const headingEl = container.querySelector('[aria-level="2"]');

      expect(queryByRole('heading')).toBeInTheDocument();
      expect(headingEl).toBeTruthy();
    });

    it('renders with passed in className', () => {
      const { container } = OGSubject({ className: 'my-class' });

      const headingEl = container.querySelector('.my-class');

      expect(headingEl).toBeTruthy();
    });

    it('renders with passed in children', () => {
      const { queryByText } = OGSubject();

      expect(queryByText('My Heading')).toBeInTheDocument();
    });

    it('renders with the passed in "data-id"', () => {
      const { container } = OGSubject({ 'data-id': 'my-id' });

      const headingEl = container.querySelector('[data-id="my-id"]');

      expect(headingEl).toBeTruthy();
    });

    it('renders with the passed in "id"', () => {
      const { container } = OGSubject({ id: 'my-id' });

      const headingEl = container.querySelector('#my-id');

      expect(headingEl).toBeTruthy();
    });
  });
});
