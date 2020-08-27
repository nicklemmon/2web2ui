import React from 'react';
import { shallow } from 'enzyme';
import { Panel } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { EngagementRecencyPage } from '../EngagementRecencyPage';

jest.mock('src/context/HibanaContext');

describe('EngagementRecencyPage', () => {
  const data = [
    {
      date: '2017-01-01',
      c_total: 1,
    },
    {
      date: '2017-01-02',
      c_total: 10,
    },
  ];
  const defaultProps = {
    facetId: 'test.com',
    facet: 'sending-domain',
    gap: 0.25,
    handleDateSelect: jest.fn(),
    loading: false,
    empty: false,
    xTicks: [1, 2],
    selectedDate: '2017-01-02',
    data,
  };

  const subject = props => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    return shallow(<EngagementRecencyPage {...defaultProps} {...props} />);
  };

  it('renders correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders loading correctly', () => {
    const wrapper = subject({ loading: true });

    expect(wrapper.find(Panel.LEGACY)).toMatchSnapshot();
  });

  it('does not render SpamTrapsPreview when facet is mb_provider', () => {
    const wrapper = subject({ facet: 'mb_provider' });

    expect(
      wrapper.find('withRouter(Connect(WithDetails(SpamTrapsPreview)))'),
    ).not.toContainMatchingElement();
  });

  it('renders empty correctly', () => {
    const wrapper = subject({ empty: true });

    expect(wrapper.find(Panel.LEGACY)).toMatchSnapshot();
  });

  it('renders error correctly', () => {
    const wrapper = subject({ error: { message: 'error message' } });

    expect(wrapper).toMatchSnapshot();
  });

  describe('bar chart props', () => {
    it('renders tooltip content', () => {
      const wrapper = subject();
      const Tooltip = wrapper.find('BarChart').prop('tooltipContent');

      expect(
        shallow(
          <Tooltip
            payload={{
              c_uneng: 0.1,
              c_365d: 0.2,
              c_90d: 0.3,
              c_14d: 0.4,
              c_new: 0.5,
              date: '2018-01-01',
              c_total: 10,
            }}
          />,
        ),
      ).toMatchSnapshot();
    });

    it('gets x axis props', () => {
      const wrapper = subject();
      const axisProps = wrapper.find('BarChart').prop('xAxisProps');

      expect(axisProps).toMatchSnapshot();
      expect(axisProps.tickFormatter('2018-12-05')).toEqual('12/5');
    });

    it('gets y axis props', () => {
      const wrapper = subject();
      const axisProps = wrapper.find('BarChart').prop('yAxisProps');

      expect(axisProps.tickFormatter(0.2468)).toEqual('25%');
    });
  });
});
