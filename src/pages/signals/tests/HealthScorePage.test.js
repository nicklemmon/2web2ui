import React from 'react';
import { shallow } from 'enzyme';
import { Panel } from 'src/components/matchbox';
import { HealthScorePage } from '../HealthScorePage';

describe('Signals Health Score Page', () => {
  let wrapper;
  let props;
  const data = [
    {
      date: '2017-01-01',
      weights: [
        { weight_type: 'Hard Bounces', weight: 0.5, weight_value: 0.25 },
        { weight_type: 'eng cohorts: new, 14-day', weight: -0.5, weight_value: 0.25 },
      ],
    },
    {
      date: '2017-01-02',
      weights: [
        { weight_type: 'List Quality', weight: 0.8, weight_value: 0.25 },
        { weight_type: 'Other bounces', weight: -0.8, weight_value: 0.25 },
      ],
    },
  ];

  beforeEach(() => {
    props = {
      facetId: 'test.com',
      facet: 'sending-domain',
      data: [],
      handleDateSelect: jest.fn(),
      selectedDate: '2017-01-01',
      handleDateHover: jest.fn(),
      hoveredDate: '2017-01-05',
      gap: 0.25,
      loading: false,
      empty: false,
      xTicks: [],
    };
    wrapper = shallow(<HealthScorePage {...props} />);
    wrapper.setProps({ data });
  });

  it('renders correctly when recieving data', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading correctly', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Panel.LEGACY)).toMatchSnapshot();
  });

  it('renders empty correctly', () => {
    wrapper.setProps({ empty: true });
    expect(wrapper.find(Panel.LEGACY)).toMatchSnapshot();
  });

  it('does not render SpamTrapsPreview when facet is mb_provider', () => {
    wrapper.setProps({ facet: 'mb_provider' });
    wrapper.update();
    expect(
      wrapper.find('withRouter(Connect(WithDetails(SpamTrapsPreview)))'),
    ).not.toContainMatchingElement();
  });

  it('renders error correctly', () => {
    wrapper.setProps({ error: { message: 'error message' } });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders empty weights', () => {
    wrapper.setProps({ data: [{ date: '2017-01-01' }] });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders weight chart at 100% if data all data is 0/undefined', () => {
    const newData = [
      {
        date: '2017-01-01',
        weights: [{ weight_type: 'Hard Bounces', weight: 0.5, weight_value: 0 }],
      },
      {
        date: '2017-01-02',
        weights: [{ weight_type: 'Hard Bounces', weight: 0.5, weight_value: undefined }],
      },
    ];
    wrapper.setProps({ data: newData });
    expect(
      wrapper
        .find('BarChart')
        .at(2)
        .prop('yDomain'),
    ).toEqual([0, 1]);
  });

  it('renders component weights bar height dynamically', () => {
    expect(
      wrapper
        .find('DivergingBar')
        .at(0)
        .prop('barHeight'),
    ).toEqual(140);
    const newData = [
      {
        date: '2017-01-01',
        weights: [
          { weight_type: 'Hard Bounces', weight: 0.5, weight_value: 0.25 },
          { weight_type: 'eng cohorts: new, 14-day', weight: -0.5, weight_value: 0.25 },
          { weight_type: 'List Quality', weight: 0.8, weight_value: 0.25 },
          { weight_type: 'Other bounces', weight: -0.8, weight_value: 0.25 },
        ],
      },
    ];
    wrapper.setProps({ data: newData });
    expect(
      wrapper
        .find('DivergingBar')
        .at(0)
        .prop('barHeight'),
    ).toEqual(70);
  });

  describe('local state', () => {
    it('handles component select', () => {
      wrapper
        .find('DivergingBar')
        .at(0)
        .simulate('click', { payload: { weight_type: 'eng cohorts: new, 14-day' } });
      expect(
        wrapper
          .find('DivergingBar')
          .at(0)
          .prop('selected'),
      ).toEqual('eng cohorts: new, 14-day');
    });

    it('uses first component weight with an existing date and new data', () => {
      wrapper = shallow(<HealthScorePage {...props} selectedDate="first-date" />);
      wrapper.setProps({
        data: [
          {
            date: 'first-date',
            weights: [
              { weight_type: 'Hard Bounces', weight: 0.5, weight_value: 0.25 },
              { weight_type: 'Complaints', weight: 0.5, weight_value: 0.25 },
            ],
          },
          { date: 'last-date' },
        ],
      });
      expect(
        wrapper
          .find('DivergingBar')
          .at(0)
          .prop('selected'),
      ).toEqual('Hard Bounces');
    });
  });

  describe('bar chart props', () => {
    it('renders tooltip content for health score', () => {
      const Tooltip = wrapper
        .find('BarChart')
        .at(0)
        .prop('tooltipContent');
      expect(
        shallow(<Tooltip payload={{ health_score: 0.12, ranking: 'danger' }} />),
      ).toMatchSnapshot();
    });

    it('renders tooltip content for injections', () => {
      const Tooltip = wrapper
        .find('BarChart')
        .at(1)
        .prop('tooltipContent');
      expect(
        shallow(<Tooltip payload={{ injections: 1000, ranking: 'good' }} />),
      ).toMatchSnapshot();
    });

    it('renders tooltip content for selected component', () => {
      wrapper
        .find('DivergingBar')
        .at(0)
        .simulate('click', { payload: { weight_type: 'eng cohorts: new, 14-day' } });
      const Tooltip = wrapper
        .find('BarChart')
        .at(2)
        .prop('tooltipContent');
      expect(
        shallow(<Tooltip payload={{ weight_value: 0.0012345, ranking: 'danger' }} />),
      ).toMatchSnapshot();
    });

    it('renders tooltip content for hovered component', () => {
      wrapper
        .find('BarChart')
        .at(0)
        .simulate('onMouseOver', {
          payload: { health_score: 0.75, ranking: 'warning', date: '2017-01-02' },
        });
      const Tooltip = wrapper
        .find('BarChart')
        .at(0)
        .prop('tooltipContent');
      expect(shallow(<Tooltip payload={{ health_score: 0.75 }} />)).toMatchSnapshot();
    });

    it('renders tooltip content for component weights', () => {
      const Tooltip = wrapper.find('DivergingBar').prop('tooltipContent');
      expect(
        shallow(<Tooltip payload={{ weight_type: 'Other bounces', ranking: 'warning' }} />),
      ).toMatchSnapshot();
    });

    it('renders y label content for component weights', () => {
      const label = wrapper.find('DivergingBar').prop('yLabel');
      expect(label({ value: 'eng cohorts: new, 14-day' })).toMatchSnapshot();
    });

    it('gets x axis props', () => {
      const axisProps = wrapper
        .find('BarChart')
        .at(0)
        .prop('xAxisProps');
      expect(axisProps).toMatchSnapshot();
      expect(axisProps.tickFormatter('2018-12-05')).toEqual('12/5');
    });

    it('renders health score y ticks', () => {
      const axisProps = wrapper
        .find('BarChart')
        .at(0)
        .prop('yAxisProps');
      expect(axisProps.tickFormatter(0.2468)).toEqual(24);
    });

    it('renders injections y ticks', () => {
      const axisProps = wrapper
        .find('BarChart')
        .at(1)
        .prop('yAxisProps');
      expect(axisProps.tickFormatter(2468)).toEqual('2.47K');
    });

    it('renders component y ticks', () => {
      const axisProps = wrapper
        .find('BarChart')
        .at(2)
        .prop('yAxisProps');
      axisProps.tickFormatter(0.003);
      expect(axisProps.tickFormatter(0.003)).toEqual('0.3%');
    });
  });
});
