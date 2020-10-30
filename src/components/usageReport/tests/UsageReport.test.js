import React from 'react';
import { shallow } from 'enzyme';
import {
  UsageReport,
  OGDisplayNumber,
  HibanaDisplayNumber,
  HibanaProgressLabel,
  OGProgressLabel,
} from '../UsageReport';

describe('UsageReport Component', () => {
  let getAccount;
  let props;

  beforeEach(() => {
    getAccount = jest.fn();

    props = {
      subscription: {
        plan_volume: 10000,
      },
      endOfBillingPeriod: '2017-08-31T08:00:00.000Z',
      startOfBillingPeriod: '2017-08-01T08:00:00.000Z',
      usage: {
        month: {
          used: 1000,
          limit: 50000,
          start: '2017-08-01T08:00:00.000Z',
          end: '2017-08-31T08:00:00.000Z',
        },
        day: {
          used: 1000,
          limit: 2000,
          start: '2017-08-30T00:00:00.000Z',
        },
      },
      getAccount,
    };
  });

  it('should render null without props', () => {
    const props = { getAccount };
    const wrapper = shallow(<UsageReport {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with regular usage', () => {
    const wrapper = shallow(<UsageReport {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(shallow(<OGDisplayNumber />)).toMatchSnapshot();
    expect(shallow(<HibanaDisplayNumber />)).toMatchSnapshot();
    expect(shallow(<OGProgressLabel />)).toMatchSnapshot();
    expect(shallow(<HibanaProgressLabel />)).toMatchSnapshot();
  });

  it('should get the account including usage', () => {
    shallow(<UsageReport {...props} />);
    expect(props.getAccount).toHaveBeenCalledWith({ include: 'usage' });
  });

  it('should render with overages', () => {
    props.usage.month.used = props.subscription.plan_volume + 1000;
    const wrapper = shallow(<UsageReport {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render limits for unrestricted accounts', () => {
    const usage = {
      day: {
        used: 1000,
        limit: null,
        start: '2017-08-30T00:00:00.000Z',
      },
      month: {
        used: 1000,
        limit: null,
        start: '2017-08-01T08:00:00.000Z',
        end: '2017-08-31T08:00:00.000Z',
      },
    };
    const wrapper = shallow(<UsageReport {...props} usage={usage} />);

    expect(wrapper.find('ProgressBar')).not.toExist();
    expect(wrapper.find('DisplayNumber[label="Daily limit"]')).not.toExist();
    expect(wrapper.find('DisplayNumber[label="Monthly limit"]')).not.toExist();
  });
});
