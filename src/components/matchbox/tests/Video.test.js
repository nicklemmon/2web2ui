import React from 'react';
import { render, screen } from '@testing-library/react';
import Video from '../Video';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('Video', () => {
  describe('the root `Video` component', () => {
    const subject = props => render(<Video {...props} />);

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });

    it('renders with passed in props', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      subject({ role: 'presentation' });

      expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
  });

  describe('the `Video.Source` component', () => {
    const subject = props => render(<Video.Source {...props} />);

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });

    it('renders `Picture.Image` with passed in props', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const { container } = subject({
        src: '/path/to/my/video',
        type: 'video/mp4',
      });

      expect(container.querySelector('[src="/path/to/my/video"]')).toBeTruthy();
      expect(container.querySelector('[type="video/mp4"]')).toBeTruthy();
    });
  });
});
