import React from 'react';
import { shallow } from 'enzyme';
import { Panel } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { SpamTrapPage } from '../SpamTrapPage';

jest.mock('src/context/HibanaContext');

useHibana.mockImplementation(() => [{ isHibanaEnabled: true }]);

describe('Signals Spam Trap Page', () => {
  const data = [
    {
      date: '2017-01-01',
      injections: 1240,
      relative_trap_hits: 0.1,
      relative_trap_hits_parked: 0.025,
      relative_trap_hits_recycled: 0.025,
      relative_trap_hits_typo: 0.05,
      trap_hits: 124,
      trap_hits_parked: 31,
      trap_hits_recycled: 31,
      trap_hits_typo: 62,
    },
    {
      date: '2017-01-02',
      injections: 424,
      relative_trap_hits: 0.5,
      relative_trap_hits_parked: 0.125,
      relative_trap_hits_recycled: 0.125,
      relative_trap_hits_typo: 0.25,
      trap_hits: 212,
      trap_hits_parked: 53,
      trap_hits_recycled: 53,
      trap_hits_typo: 106,
    },
  ];

  const defaultProps = {
    facetId: 'test.com',
    facet: 'sending-domain',
    data,
    gap: 0.25,
    handleDateSelect: jest.fn(),
    loading: false,
    empty: false,
    selectedDate: '2017-01-01',
    xTicks: [],
  };

  const subject = props => {
    return shallow(<SpamTrapPage {...defaultProps} {...props} />);
  };

  it('renders correctly', () => {
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading correctly', () => {
    const wrapper = subject({ loading: true });

    expect(wrapper.find(Panel.LEGACY)).toMatchSnapshot();
  });

  it('renders empty correctly', () => {
    const wrapper = subject({ empty: true });

    expect(wrapper.find(Panel.LEGACY)).toMatchSnapshot();
  });

  it('renders error correctly', () => {
    const wrapper = subject({ error: { message: 'error message' } });

    expect(wrapper).toMatchSnapshot();
  });

  describe('local state', () => {
    it('handles calculation type', () => {
      const wrapper = subject();
      const calculation = shallow(wrapper.find('ChartHeader').props().primaryArea);

      calculation.simulate('change', 'absolute');

      expect(wrapper.find('BarChart').prop('yKeys')).toEqual([
        expect.objectContaining({ key: 'trap_hits_typo' }),
        expect.objectContaining({ key: 'trap_hits_recycled' }),
        expect.objectContaining({ key: 'trap_hits_parked' }),
      ]);
    });
  });

  describe('bar chart props', () => {
    it('renders tooltip content', () => {
      const wrapper = subject();
      const Tooltip = wrapper.find('BarChart').prop('tooltipContent');

      expect(shallow(<Tooltip payload={data[0]} />)).toMatchSnapshot();
    });

    it('gets x axis props', () => {
      const wrapper = subject({ calculation: 'relative' });
      const calculation = shallow(wrapper.find('ChartHeader').props().primaryArea);
      calculation.simulate('change', 'absolute');
      const axisProps = wrapper.find('BarChart').prop('xAxisProps');
      expect(axisProps).toMatchSnapshot();
      expect(axisProps.tickFormatter('2018-12-05')).toEqual('12/5');
    });

    it('gets y axis props with relative calculation', () => {
      const wrapper = subject({ calculation: 'absolute' });
      const calculation = shallow(wrapper.find('ChartHeader').props().primaryArea);
      calculation.simulate('change', 'relative');
      const axisProps = wrapper.find('BarChart').prop('yAxisProps');
      expect(axisProps.tickFormatter(0.2468)).toEqual('24.68%');
    });

    it('gets y axis props with absolute calculation', () => {
      const wrapper = subject({ calculation: 'relative' });
      const calculation = shallow(wrapper.find('ChartHeader').props().primaryArea);

      calculation.simulate('change', 'absolute');

      const axisProps = wrapper.find('BarChart').prop('yAxisProps');

      expect(axisProps.tickFormatter(2468)).toEqual('2.47K');
      expect(axisProps.domain).toEqual(['auto', 'auto']);
    });

    it('gets y axis props with relative calculation and 0 values', () => {
      const wrapper = subject({
        calculation: 'absolute',
        data: [{ relative_trap_hits: 0 }, { relative_trap_hits: null }],
      });
      const calculation = shallow(wrapper.find('ChartHeader').props().primaryArea);

      calculation.simulate('change', 'relative');

      const axisProps = wrapper.find('BarChart').prop('yAxisProps');

      expect(axisProps.domain).toEqual([0, 1]);
    });
  });
});
