import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import TestApp from 'src/__testHelpers__/TestApp';
import CreditCardSection from '../CreditCardSection';

describe('CreditCardSection', () => {
  const defaultProps = {
    handleCardToggle: jest.fn(),
    creditCard: {
      type: 'Visa',
      number: '12345678',
      expiration_month: '04',
      expiration_year: 2022,
    },
  };

  it('should render credit card Summary when credit_card is present', () => {
    const instance = render(
      <TestApp>
        <CreditCardSection {...defaultProps} />
      </TestApp>,
    );

    expect(instance.queryByText('Pay With Saved Payment Method')).toBeInTheDocument();
    expect(instance.queryByText('Expires 04/2022')).toBeInTheDocument();
  });

  it('should render credit card form when credit_card is not present', () => {
    const instance = shallow(<CreditCardSection {...defaultProps} creditCard={null} />);
    expect(instance.find('PaymentForm')).toHaveLength(1);
    expect(instance.find('Connect(BillingAddressForm)')).toHaveLength(1);
  });
});
