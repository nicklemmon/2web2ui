import { shallow, mount } from 'enzyme';
import React from 'react';
import TestApp from 'src/__testHelpers__/TestApp';
import JobsTableCollection from '../components/JobsTableCollection';
import { RecipientValidationPage } from '../RecipientValidationPage';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import styles from '../RecipientValidationPage.module.scss';

jest.mock('src/hooks/useHibanaOverride');

jest.mock('src/pages/recipientValidation/components/ValidateSection', () => {
  return function ValidateSection() {
    return <div>ValidateSection</div>;
  };
});

jest.mock('src/pages/recipientValidation/components/SingleAddressForm', () => {
  return {
    SingleAddressTab: () => {
      return <div>SingleAddressForm</div>;
    },
  };
});

const defaultProps = {
  account: {},
  billing: { credit_card: {} },
  history: {
    replace: jest.fn(),
  },
  getBillingInfo: jest.fn(),
  getBillingSubscription: jest.fn(),
  resetAddRVtoSubscription: jest.fn(),
  reset: jest.fn(),
  handleSubmit: jest.fn(),
};

describe('Page: Recipient Email Verification (shallow)', () => {
  beforeEach(() => {
    useHibanaOverride.mockReturnValue(styles);
    jest.mock('src/context/HibanaContext');
  });

  let wrapper;

  const subject = props => shallow(<RecipientValidationPage {...defaultProps} {...props} />);

  it('should render Recipient Validation page correctly', () => {
    wrapper = subject();
    expect(wrapper.find('withRouter(Connect(ListForm))')).toExist();
    expect(wrapper.find(JobsTableCollection)).toExist();
  });

  it('renders single email verification tab correctly when selected', () => {
    wrapper = subject({ tab: 1 });
    expect(wrapper.find('SingleAddressTab')).toExist();
  });

  it('renders Api tab correctly when selected', () => {
    wrapper = subject({ tab: 2 });
    expect(wrapper.find('ApiDetails')).toExist();
  });

  it('when billingLoading is true ValidateSection is not rendered', () => {
    const instance = subject({ billingLoading: true, tab: 1 });
    expect(instance.find('ValidateSection')).not.toExist();
  });

  it('renders a API Docs button in Panel when API Integration Tab is selected', () => {
    const instance = subject({ tab: 2 });
    expect(
      instance
        .find('ExternalLink')
        .first()
        .prop('children'),
    ).toEqual('API Docs');
  });

  it('renders a ValidateSection', () => {
    const instance = subject({ tab: 2 });
    expect(instance.find('ValidateSection')).toExist();
  });
});

describe('Page: Recipient Email Verification (full)', () => {
  beforeEach(() => {
    useHibanaOverride.mockReturnValue(styles);
  });
  const subject_mount = props =>
    mount(
      <TestApp>
        <RecipientValidationPage {...defaultProps} {...props} />
      </TestApp>,
    );

  it('getBillingInfo and getBillingSubscription is called when Recipient Validation Page mounts', () => {
    subject_mount({ tab: 1 });
    expect(defaultProps.getBillingInfo).toHaveBeenCalled();
    expect(defaultProps.getBillingSubscription).toHaveBeenCalled();
  });
});
