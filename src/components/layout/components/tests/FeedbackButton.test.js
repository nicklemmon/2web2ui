import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'src/components/matchbox';
import { GUIDE_IDS } from 'src/constants';
import FeedbackButton from '../FeedbackButton';

let mockIsHibanaEnabled;

jest.mock('src/context/HibanaContext', () => ({
  useHibana: () => [{ isHibanaEnabled: mockIsHibanaEnabled }],
}));

describe('FeedbackButton', () => {
  const mockshow = jest.fn();

  const renderSubject = () => {
    return render(
      <ThemeProvider>
        <FeedbackButton />
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    window.Appcues = {};
    window.Appcues.show = mockshow;
  });

  it('invokes `window.Appcues.show` when clicked', () => {
    mockIsHibanaEnabled = true;
    renderSubject();

    screen.getByText('Give Feedback').click();
    expect(mockshow).toHaveBeenCalledWith(GUIDE_IDS.GIVE_HIBANA_FEEDBACK);
  });

  it('does not render when window.Appcues is undefined', () => {
    mockIsHibanaEnabled = true;
    delete window.Appcues;
    renderSubject();

    expect(screen.queryByText('Give Feedback')).not.toBeInTheDocument();
  });

  it('does not render when Hibana is not enabled', () => {
    mockIsHibanaEnabled = false;
    renderSubject();

    expect(screen.queryByText('Give Feedback')).not.toBeInTheDocument();
  });
});
