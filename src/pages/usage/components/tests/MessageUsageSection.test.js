import React from 'react';
import { shallow } from 'enzyme';
import MessagingUsageSection from '../MessagingUsageSection';

describe('MessageUsageSection', () => {
  const defaultProps = {
    subscription: {
      plan_volume: 100000,
    },
    usage: {
      timestamp: '2020-08-04T14:55:00.000Z',
      day: {
        used: 261010,
        start: '2020-08-03T15:00:00.000Z',
        end: '2020-08-04T15:00:00.000Z',
      },
      month: {
        used: 18992748,
        start: '2020-07-05T08:00:00.000Z',
        end: '2020-08-05T08:00:00.000Z',
      },
      sandbox: {
        limit: 5,
        used: 184409,
      },
    },
  };

  const instance = (props = {}) => shallow(<MessagingUsageSection {...defaultProps} {...props} />);
  describe('should display Upgrade section only if the usage is nearing limit', () => {
    it("if usage is already over limit Upgrade section doesn't render", () => {
      expect(instance()).not.toHaveTextContent('Upgrade');
    });
    it('if usage is nearing limit, that is almost 90%, then Upgrade section is displayed', () => {
      expect(
        instance({
          usage: {
            timestamp: '2020-08-04T14:55:00.000Z',
            day: {
              used: 261010,
              start: '2020-08-03T15:00:00.000Z',
              end: '2020-08-04T15:00:00.000Z',
            },
            month: {
              used: 95000,
              start: '2020-07-05T08:00:00.000Z',
              end: '2020-08-05T08:00:00.000Z',
            },
            sandbox: {
              limit: 5,
              used: 184409,
            },
          },
        }),
      ).toHaveTextContent('Upgrade');
    });
  });
  it('should display overage label and value if there is a overage', () => {
    expect(instance()).toHaveTextContent('Overages');
    expect(
      instance({
        usage: {
          timestamp: '2020-08-04T14:55:00.000Z',
          day: {
            used: 261010,
            start: '2020-08-03T15:00:00.000Z',
            end: '2020-08-04T15:00:00.000Z',
          },
          month: {
            used: 95000,
            start: '2020-07-05T08:00:00.000Z',
            end: '2020-08-05T08:00:00.000Z',
          },
          sandbox: {
            limit: 5,
            used: 184409,
          },
        },
      }),
    ).not.toHaveTextContent('Overages');
  });
  it('should render Monthly limit label and value if one is present', () => {
    expect(instance()).not.toHaveTextContent('Monthly Limit');
  });
});
