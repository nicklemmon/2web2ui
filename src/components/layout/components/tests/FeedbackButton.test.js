import React from 'react';
import { render, screen } from '@testing-library/react';
import FeedbackButton from '../FeedbackButton';
import { GUIDE_IDS } from 'src/constants';
import { useHibana } from 'src/context/HibanaContext';

jest.mock('src/context/HibanaContext');
useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

describe('FeedbackButton', () => {
  const mockShowGuideById = jest.fn();
  const renderSubject = () => {
    render(<FeedbackButton />);
  };

  beforeEach(() => {
    window.pendo = {};
    window.pendo.showGuideById = mockShowGuideById;
  });

  it('invokes `window.pendo.showGuideById` when clicked', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    renderSubject();

    screen.getByText('Give Feedback').click();
    expect(mockShowGuideById).toHaveBeenCalledWith(GUIDE_IDS.GIVE_HIBANA_FEEDBACK);
  });

  it('does not render when window.pendo is undefined', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    delete window.pendo;
    renderSubject();

    expect(screen.queryByText('Give Feedback')).not.toBeInTheDocument();
  });

  it('does not render when Hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    renderSubject();

    expect(screen.queryByText('Give Feedback')).not.toBeInTheDocument();
  });
});
