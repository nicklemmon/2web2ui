import React from 'react';
import { shallow } from 'enzyme';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import SetupInstructionPanel from '../SetupInstructionPanel';
import styles from '../SetupInstructionPanel.module.scss';

jest.mock('src/hooks/useHibanaOverride');

describe('SetupInstructionPanel', () => {
  const subject = (props = {}) => {
    useHibanaOverride.mockImplementationOnce(() => styles);
    return shallow(
      <SetupInstructionPanel
        recordType="CNAME"
        verifyButtonIdentifier="my-verify-button"
        {...props}
      >
        <p>enter panel contents here...</p>
      </SetupInstructionPanel>,
    );
  };

  const titleFactory = wrapper => shallow(wrapper.prop('title'));

  it('renders panel and children', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('calls onVerify when verify button is clicked', () => {
    const onVerify = jest.fn();
    const wrapper = subject({ onVerify });
    wrapper.prop('actions')[0].onClick();
    expect(onVerify).toHaveBeenCalled();
  });

  it('disables verify button when verifying', () => {
    const wrapper = subject({ isVerifying: true });
    expect(wrapper).toHaveProp('actions', [expect.objectContaining({ disabled: true })]);
  });

  it('hides verify button when auto verify is enabled', () => {
    const wrapper = subject({ isAutoVerified: true });
    expect(wrapper).toHaveProp('actions', []);
  });

  describe('when verified', () => {
    const wrapper = subject({ isVerified: true });

    it('renders a re-verify button', () => {
      // 😳 Very tightly coupled to the implementation - ideally we would just be looking at the DOM here
      expect(wrapper.props().actions[0].content.props.children).toBe('Re-verify CNAME Record');
    });

    it('renders a verified icon', () => {
      const titleWrapper = titleFactory(wrapper);
      expect(titleWrapper.find('VerifiedIcon')).toExist();
    });
  });
});
