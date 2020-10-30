import { shallow } from 'enzyme';
import React from 'react';
import PaymentForm from 'src/components/billing/PaymentForm';
import BillingAddressForm from 'src/components/billing/BillingAddressForm';
import CreditCardSection from '../CreditCardSection';
describe('creditCardSection', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      billing: {
        countries: [],
      },
      submitting: false,
      isPlanFree: undefined,
    };
    wrapper = shallow(<CreditCardSection {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when selectedPlan is Free', () => {
    props.isPlanFree = true;
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when form is being submitted', () => {
    props.submitting = true;
    wrapper.setProps(props);
    expect(wrapper.find(PaymentForm).prop('disabled')).toBeTruthy();
    expect(wrapper.find(BillingAddressForm).prop('disabled')).toBeTruthy();
  });
});
