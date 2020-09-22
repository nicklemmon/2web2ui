import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportsListModal } from '../ReportsListModal';
import TestApp from 'src/__testHelpers__/TestApp';

describe('ReportsListModal', () => {
  const subject = props => {
    const defaults = {
      currentUser: 'Sparky McSparkFace',
      open: true,
      reports: [
        {
          creator: 'Sparky McSparkFace',
          name: 'My Saved Report',
          modified: '2020-09-02T13:00:00.000Z',
        },
      ],
    };

    render(
      <TestApp isHibanaEnabled={true}>
        <ReportsListModal {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders modal correctly', () => {
    subject();
    const testFirstTab = texts => {
      texts.forEach(text => {
        expect(screen.getByText(text)).toBeVisible();
      });
    };
    const testSecondTab = texts => {
      texts.forEach(text => {
        expect(screen.getAllByText(text)).toHaveLength(2);
        expect(screen.getAllByText(text)[0]).not.toBeVisible();
        expect(screen.getAllByText(text)[1]).toBeVisible();
      });
    };

    expect(screen.getByText('My Reports')).toBeVisible();
    expect(screen.getByText('All Reports')).toBeVisible();
    testFirstTab(['Name', 'Last Modification', 'My Saved Report', /Sep [123] 2020/]);
    screen.getByText('All Reports').click();
    testSecondTab(['Name', 'Last Modification', 'My Saved Report', /Sep [123] 2020/]);
    expect(screen.getByText('Created By')).toBeVisible();
    expect(screen.getByText('Sparky McSparkFace')).toBeVisible();
  });
});
