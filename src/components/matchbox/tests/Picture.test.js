import React from 'react';
import { render, screen } from '@testing-library/react';
import Picture from '../Picture';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('Picture', () => {
  describe('the root `Picture` component', () => {
    const subject = props => render(<Picture {...props} />);

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });

    it('renders with passed in props', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const { container } = subject({ children: <source />, role: 'presentation' });

      expect(screen.getByRole('presentation')).toBeInTheDocument();
      expect(container.querySelector('source')).toBeTruthy();
    });
  });

  describe('the `Picture.Image` component', () => {
    const subject = props => render(<Picture.Image {...props} />);

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });

    it('renders `Picture.Image` with passed in props', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const { container } = subject({
        alt: 'My Image',
        className: 'my-class',
        src: '/path/to/my/image',
      });

      expect(container.querySelector('[alt="My Image"]')).toBeTruthy();
      expect(container.querySelector('.my-class')).toBeTruthy();
      expect(container.querySelector('[src="/path/to/my/image"]')).toBeTruthy();
    });
  });
});
