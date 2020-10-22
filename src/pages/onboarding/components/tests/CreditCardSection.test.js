import { shallow } from 'enzyme';
import React from 'react';
import CreditCardSection from '../CreditCardSection';
describe('creditCardSection', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      billing: {
        countries: []
      },
      submitting: false,
      isPlanFree: undefined
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
    expect(wrapper.find('Connect(PaymentForm)').prop('disabled')).toBeTruthy();
    expect(wrapper.find('Connect(BillingAddressForm)').prop('disabled')).toBeTruthy();
  });


});

