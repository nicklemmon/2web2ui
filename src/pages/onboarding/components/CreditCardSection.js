import React from 'react';
import { Panel, Stack } from 'src/components/matchbox';
import PaymentForm from 'src/components/billing/PaymentForm';
import BillingAddressForm from 'src/components/billing/BillingAddressForm';
import { FORMS } from 'src/constants';

const CreditCardSection = ({ billing, submitting, isPlanFree }) => {
  if (isPlanFree) {
    return (
      <Panel.LEGACY.Section>
        <Stack>
          <p>Full featured test account that includes:</p>
          <ul>
            <li>Limited sending volume for testing.</li>
            <li>Access to all of our powerful API features.</li>
            <li>Free technical support to get you up and running.</li>
          </ul>
        </Stack>
      </Panel.LEGACY.Section>
    );
  }

  return (
    <>
      <Panel.LEGACY.Section>
        <PaymentForm formName={FORMS.JOIN_PLAN} disabled={submitting} />
      </Panel.LEGACY.Section>
      <Panel.LEGACY.Section>
        <BillingAddressForm
          formName={FORMS.JOIN_PLAN}
          disabled={submitting}
          countries={billing.countries}
        />
      </Panel.LEGACY.Section>
    </>
  );
};

export default CreditCardSection;
