import React from 'react';
import { shallow } from 'enzyme';
import { Panel } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { ComplaintsByCohortPage } from '../ComplaintsByCohortPage';

jest.mock('src/context/HibanaContext');

describe('ComplaintsByCohortPage', () => {
  const data = [
    {
      date: '2017-01-01',
      p_total_fbl: 1,
    },
    {
      date: '2017-01-02',
      p_total_fbl: 10,
    },
  ];
  const dataEngRecency = [
    {
      date: '2017-01-01',
      c_uneng: 0.25,
    },
    {
      date: '2017-01-02',
      c_uneng: 0.5,
    },
  ];

  const defaultProps = {
    facetId: 'test.com',
    facet: 'sending-domain',
    handleDateSelect: jest.fn(),
    gap: 0.25,
    loading: false,
    empty: false,
    xTicks: [1, 2],
    selectedDate: '2017-01-02',
    shouldHighlightSelected: false,
    data,
    dataEngRecency,
  };

  const subject = props => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    return shallow(<ComplaintsByCohortPage {...defaultProps} {...props} />);
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

    expect(wrapper).toHaveTextContent('Unable to Load Data');
  });

  describe('bar chart props', () => {
    it('renders tooltip content', () => {
      const wrapper = subject();
      const Tooltip = wrapper.find('LineChart').prop('tooltipContent');

      expect(
        shallow(
          <Tooltip
            payload={{
              p_uneng_fbl: 0.11111,
              p_365d_fbl: 0.2,
              p_90d_fbl: 0.3,
              p_14d_fbl: 0.4,
              p_new_fbl: 0.5,
              date: '2018-01-01',
              p_total_fbl: 10,
            }}
          />,
        ),
      ).toMatchSnapshot();
    });

    it('gets x axis props', () => {
      const wrapper = subject();
      const axisProps = wrapper.find('LineChart').prop('xAxisProps');

      expect(axisProps.ticks).toEqual([1, 2]);
      expect(axisProps.tickFormatter('2018-12-05')).toEqual('12/5');
    });

    it('gets y axis props with default domain', () => {
      const wrapper = subject({ data: [{ p_total_fbl: 0 }, { p_total_fbl: null }] });
      const axisProps = wrapper.find('LineChart').prop('yAxisProps');

      expect(axisProps.tickFormatter(0.252344)).toEqual('25.234%');
      expect(axisProps.domain).toEqual([0, 1]);
    });

    it('gets y axis props with domain', () => {
      const wrapper = subject({ data: [{ p_total_fbl: 0.5 }, { p_total_fbl: 0.6 }] });
      const axisProps = wrapper.find('LineChart').prop('yAxisProps');

      expect(axisProps.domain).toEqual(['auto', 'auto']);
    });
  });
});
