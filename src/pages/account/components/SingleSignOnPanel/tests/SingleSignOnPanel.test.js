import React from 'react';
import { shallow } from 'enzyme';
import { SingleSignOnPanel } from '../SingleSignOnPanel';

describe('SingleSignOnPanel', () => {
  let wrapper, defaultProps;

  beforeEach(() => {
    defaultProps = {
      getAccountSingleSignOnDetails: jest.fn(),
      updateAccountSingleSignOn: jest.fn(),
      isSsoScimUiEnabled: false,
    };
    wrapper = props => shallow(<SingleSignOnPanel {...defaultProps} {...props} />);
  });

  it('renders with panel loading', () => {
    const subject = wrapper({ loading: true });

    expect(subject.find('PanelLoading')).toExist();
  });

  it('renders with provider and status section', () => {
    const subject = wrapper({
      cert: 'abc==',
      enabled: true,
      loading: false,
      provider: 'https://sso.sparkpost.com/redirect',
      updateError: 'Oh no!',
      updatedAt: '2018-09-11T19:39:06+00:00',
    });

    expect(subject.find('ProviderSection')).toExist();
    expect(subject.find('ProviderSection')).toHaveProp(
      'provider',
      'https://sso.sparkpost.com/redirect',
    );

    expect(subject.find('StatusSection')).toExist();
    expect(subject.find('StatusSection')).toHaveProp('cert', 'abc==');
    expect(subject.find('StatusSection')).toHaveProp('enabled', true);
    expect(subject.find('StatusSection')).toHaveProp('updateError', 'Oh no!');
    expect(subject.find('StatusSection')).toHaveProp('updatedAt', '2018-09-11T19:39:06+00:00');
    expect(subject.find('StatusSection')).toHaveProp(
      'provider',
      'https://sso.sparkpost.com/redirect',
    );
  });

  it('renders with tfaRequired', () => {
    expect(wrapper({ tfaRequired: true })).toHaveTextContent(
      'Single sign-on is not available while two-factor authentication is required on this account.',
    );
  });

  describe('renders SCIM Section when isSsoScimUiEnabled is true', () => {
    it('renders with scim section', () => {
      const subject = wrapper({
        cert: 'abc==',
        enabled: true,
        loading: false,
        provider: 'https://sso.sparkpost.com/redirect',
        updateError: 'Oh no!',
        updatedAt: '2018-09-11T19:39:06+00:00',
        isSsoScimUiEnabled: true,
        scimTokenList: [],
        newScimToken: 'fake-token',
      });

      expect(subject.find('SCIMTokenSection')).toHaveLength(1);
    });
  });
});
