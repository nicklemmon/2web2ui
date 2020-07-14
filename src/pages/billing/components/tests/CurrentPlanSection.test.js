import React from 'react';
import { shallow } from 'enzyme';
import CurrentPlanSection from '../CurrentPlanSection';
import styles from './CurrentPlanSection.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

jest.mock('src/hooks/useHibanaOverride');
useHibanaOverride.mockReturnValue(styles);

describe('CurrentPlanSection', () => {
  const defaultProps = {
    currentPlan: {
      tier: 'starter',
      code: 'big-code',
      monthly: 300,
      name: 'Three',
      overage: 0.3,
      volume: 3,
    },
  };
  const subject = props => shallow(<CurrentPlanSection {...defaultProps} {...props} />);

  it('renders correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders warning banner if current plan is deprecated', () => {
    expect(subject().find('Warning')).not.toExist();
    const wrapper = subject({
      currentPlan: { ...defaultProps.currentPlan, status: 'deprecated' },
      isPlanSelected: true,
    });
    expect(wrapper.find('Warning')).toExist();
  });
});
