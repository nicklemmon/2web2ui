import React from 'react';
import { Panel } from 'src/components/matchbox';
import { PaymentForm } from './PaymentForm';
import BillingAddressForm from './BillingAddressForm';
import CardSummary from './CardSummary';

function CreditCardSection({
  handleCardToggle,
  creditCard: credit_card,
  formname: FORMNAME,
  submitting = false,
  countries = [],
  defaultToggleState = false,
}) {
  const handleUseAnotherCC = () => {
    handleCardToggle(!Boolean(defaultToggleState));
  };
  const savedPaymentAction = credit_card
    ? [{ content: 'Use Saved Payment Method', onClick: handleUseAnotherCC, color: 'orange' }]
    : null;

  if (!credit_card || Boolean(defaultToggleState))
    return (
      <Panel.LEGACY title="Add a Credit Card" actions={savedPaymentAction}>
        <Panel.LEGACY.Section>
          <PaymentForm formName={FORMNAME} disabled={submitting} />
        </Panel.LEGACY.Section>
        <Panel.LEGACY.Section>
          <BillingAddressForm formName={FORMNAME} disabled={submitting} countries={countries} />
        </Panel.LEGACY.Section>
      </Panel.LEGACY>
    );
  return (
    <Panel.LEGACY
      title="Pay With Saved Payment Method"
      actions={[
        { content: 'Use Another Credit Card', onClick: handleUseAnotherCC, color: 'orange' },
      ]}
    >
      <Panel.LEGACY.Section>
        <CardSummary credit_card={credit_card} />
      </Panel.LEGACY.Section>
    </Panel.LEGACY>
  );
}

export default CreditCardSection;
