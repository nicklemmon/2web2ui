import { mount, shallow } from 'enzyme';
import React from 'react';
import { HealthScoreDashboard } from '../HealthScoreDashboard';
import TestApp from 'src/__testHelpers__/TestApp';
// Child components are mocked because
// 1. useEffect requires enzyme mount to test
// 2. child components are connected to redux
// This avoids setting up a mock store
jest.mock('../../containers/HealthScoreOverviewContainer');
jest.mock('../components/CurrentHealthGauge/CurrentHealthGauge');
jest.mock('../components/HealthScoreChart/HealthScoreChart');
jest.mock('../../components/filters/FacetFilter');
jest.mock('../../components/filters/DateFilter');
jest.mock('../../components/filters/SubaccountFilter');
jest.mock('src/hooks/useRouter', () =>
  jest.fn().mockReturnValue({
    requestParams: {},
    updateRoute: jest.fn(),
  }),
);

describe('Signals Health Score Dashboard', () => {
  const subject = (props = {}, render = shallow) => {
    return render === mount
      ? render(
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
        )
      : render(
          <HealthScoreDashboard
            getCurrentHealthScore={() => {}}
            getSubaccounts={() => {}}
            relativeRange="90days"
            from="2015-01-01"
            to="2015-01-05"
            subaccounts={['sub1', 'sub2']}
            location={{ search: {} }}
            {...props}
          />,
        );
  };

  it('renders page', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('calls getSubaccounts on mount', () => {
    const getSubaccounts = jest.fn();
    subject({ getSubaccounts }, mount);
    expect(getSubaccounts).toHaveBeenCalled();
  });

  it('calls getCurrentHealthScore on mount', () => {
    const getCurrentHealthScore = jest.fn();
    subject({ getCurrentHealthScore }, mount);
    expect(getCurrentHealthScore).toHaveBeenCalledWith({
      from: '2015-01-01',
      limit: 1,
      order: 'asc',
      relativeRange: '90days',
      to: '2015-01-05',
    });
  });
});
