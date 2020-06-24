import React from 'react';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import CongratsBanner from '../CongratsBanner';

describe('Blocklist Component: CongratsBanner', () => {
  const mockDismiss = jest.fn();
  const subject = ({ ...props }) => {
    const defaults = { mockDismiss };

    return render(
      <TestApp>
        <CongratsBanner {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders the banner correctly', () => {
    const { queryByText } = subject();
    expect(
      queryByText('Congratulations! You are not currently on a Blocklist'),
    ).toBeInTheDocument();
  });

  it('renders the content correctly', () => {
    const { queryByText } = subject({ content: 'Testing 123' });
    expect(queryByText('Testing 123')).toBeInTheDocument();
  });

  it('renders the title correctly', () => {
    const { queryByText } = subject({ title: 'Testing Title' });
    expect(queryByText('Testing Title')).toBeInTheDocument();
  });
});
