import { shallow } from 'enzyme';
import React from 'react';
import SettingsView from '../SettingsView';
import { Panel } from 'src/components/matchbox';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import styles from './View.module.scss';
jest.mock('src/hooks/useHibanaOverride');
describe('Settings View Component', () => {
  let wrapper;
  let defaultProps;
  let subject;

  beforeEach(() => {
    defaultProps = {
      test: {
        test_mode: 'bayesian',
        confidence_level: 0.55,
        metric: 'count_unique_clicked',
        engagement_timeout: 14,
        total_sample_size: 100,
        audience_selection: 'sample_size',
      },
    };
    useHibanaOverride.mockReturnValue(styles);
    subject = props => shallow(<SettingsView {...defaultProps} {...props} />);
    wrapper = subject();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render learning mode correctly', () => {
    wrapper = subject({ test: { ...defaultProps.test, test_mode: 'learning' } });
    expect(wrapper.find(Panel.LEGACY.Section).first()).toMatchSnapshot();
  });
});
