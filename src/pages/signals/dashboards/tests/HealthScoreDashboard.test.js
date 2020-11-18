import React from 'react';
import { render } from '@testing-library/react';
import { HealthScoreDashboard } from '../HealthScoreDashboard';
import TestApp from 'src/__testHelpers__/TestApp';
// Mock components that rely on Redux store
jest.mock('../../containers/HealthScoreOverviewContainer');
jest.mock('../components/CurrentHealthGauge/CurrentHealthGauge');
jest.mock('../components/HealthScoreChart/HealthScoreChart');
jest.mock('../../components/filters/FacetFilter');
jest.mock('../../components/filters/DateFilter');
jest.mock('../../components/filters/SubaccountFilter');
jest.mock('src/hooks/usePageFilters', () => {
  return jest.fn(() => ({
    filters: {},
    updateFilters: jest.fn(),
  }));
});

describe('Signals Health Score Dashboard', () => {
  const subject = (props = {}) => {
    return render(
      <TestApp>
        <HealthScoreDashboard
          getCurrentHealthScore={() => {}}
          getSubaccounts={() => {}}
          relativeRange="90days"
          from="2015-01-01"
          to="2015-01-05"
          subaccounts={['sub1', 'sub2']}
          location={{ search: {} }}
          {...props}
        />
      </TestApp>,
    );
  };

  it('calls getSubaccounts on mount', () => {
    const getSubaccounts = jest.fn();
    subject({ getSubaccounts });
    expect(getSubaccounts).toHaveBeenCalled();
  });

  it('calls getCurrentHealthScore on mount', () => {
    const getCurrentHealthScore = jest.fn();
    subject({ getCurrentHealthScore });
    expect(getCurrentHealthScore).toHaveBeenCalledWith({
      from: '2015-01-01',
      limit: 1,
      order: 'asc',
      relativeRange: '90days',
      to: '2015-01-05',
    });
  });
});
