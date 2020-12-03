import React, { Component } from 'react';
import { useDispatch } from 'react-redux';
import { ContentCopy, Eco } from '@sparkpost/matchbox-icons';
import copy from 'copy-to-clipboard';
import { LabelledValue, ButtonWrapper } from 'src/components';
import { PageLink } from 'src/components/links';
import { Box, Button, CodeBlock, Panel, Modal, Stack } from 'src/components/matchbox';
import { ButtonLink } from 'src/components/links';
import { Bold, Heading, TranslatableText } from 'src/components/text';
import { showAlert } from 'src/actions/globalAlert';
import { OGOnlyWrapper } from 'src/components/hibana';
import {
  PremiumBanner,
  EnterpriseBanner,
  PendingPlanBanner,
  FreePlanWarningBanner,
} from './Banners';
import UpdatePaymentForm from '../forms/UpdatePaymentForm';
import UpdateContactForm from '../forms/UpdateContactForm';
import AddIps from '../forms/AddIps';
import DedicatedIpSummarySection from './DedicatedIpSummarySection';
import InvoiceHistory from './InvoiceHistory';
import CardSummary from 'src/components/billing/CardSummary';
import PlanSummary from './PlanSummary';
import RecipientValidationModal from './RecipientValidationModal';
import { formatFullNumber } from 'src/helpers/units';
import totalRVCost from 'src/helpers/recipientValidation';
import _ from 'lodash';
import { formatDateTime } from 'src/helpers/date';
import { Text } from 'src/components/matchbox';
const PAYMENT_MODAL = 'payment';
const CONTACT_MODAL = 'contact';
const IP_MODAL = 'ip';
const RV_MODAL = 'recipient_validation';
const CARBON_OFFSET_MODAL = 'carbon_offset';

export default class BillingSummary extends Component {
  state = {
    show: false,
  };

  handleModal = (modal = false) => {
    this.setState({ show: this.state.show ? false : modal });
  };

  handlePaymentModal = () => this.handleModal(PAYMENT_MODAL);
  handleContactModal = () => this.handleModal(CONTACT_MODAL);
  handleCarbonModal = () => this.handleModal(CARBON_OFFSET_MODAL);
  handleIpModal = () => this.handleModal(IP_MODAL);
  handleRvModal = () => this.handleModal(RV_MODAL, true);

  renderSummary = () => {
    const { account } = this.props;
    const { billing } = account;
    return (
      <Panel.LEGACY title="Billing" data-id="billing-panel">
        <Panel.LEGACY.Section
          actions={[
            {
              content: 'Update Payment Information',
              onClick: this.handlePaymentModal,
              color: 'orange',
            },
          ]}
        >
          <CardSummary label="Credit Card" credit_card={billing.credit_card} />
        </Panel.LEGACY.Section>
        <Panel.LEGACY.Section
          actions={[
            {
              content: 'Update Billing Contact',
              onClick: this.handleContactModal,
              color: 'orange',
            },
          ]}
        >
          <LabelledValue label="Billing Contact">
            <h6>
              {billing.first_name} {billing.last_name}
            </h6>
            <p>{billing.email}</p>
          </LabelledValue>
        </Panel.LEGACY.Section>
      </Panel.LEGACY>
    );
  };

  renderDedicatedIpSummarySection = isTransitioningToSelfServe => (
    <DedicatedIpSummarySection
      count={this.props.sendingIps.length}
      plan={this.props.currentPlan}
      canPurchaseIps={this.props.canPurchaseIps}
      onClick={this.handleIpModal}
      isTransitioningToSelfServe={isTransitioningToSelfServe}
    />
  );

  renderRecipientValidationSection = ({ rvUsage }) => {
    const volumeUsed = _.get(rvUsage, 'recipient_validation.month.used', 0);
    const recipientValidationDate = _.get(rvUsage, 'recipient_validation.timestamp');
    return (
      <Panel.LEGACY.Section>
        <LabelledValue label="Recipient Validation">
          <h6>
            <Text fontSize="300" as="span">
              {formatFullNumber(volumeUsed)} emails validated for {totalRVCost(volumeUsed)}
              <Text fontWeight="200" as="span">
                {' '}
                as of {formatDateTime(recipientValidationDate)}
              </Text>
            </Text>
          </h6>
          <ButtonLink onClick={this.handleRvModal}>How was this calculated?</ButtonLink>
        </LabelledValue>
      </Panel.LEGACY.Section>
    );
  };

  render() {
    const {
      account,
      subscription: billingSubscription,
      currentPlan,
      canChangePlan,
      canUpdateBillingInfo,
      invoices,
      accountAgeInDays,
    } = this.props;
    const { rvUsage, pending_cancellation, subscription, billing = {} } = account;
    const { show } = this.state;
    // This is an extreme case to support manually billed accounts while transitioning to self serve
    const isTransitioningToSelfServe =
      billing !== null && !billing.credit_card && subscription.type === 'default';

    const volumeUsed = _.get(rvUsage, 'recipient_validation.month.used', 0);

    const changePlanActions = [];
    if (!pending_cancellation && canChangePlan && !isTransitioningToSelfServe) {
      const changePlanLabel = currentPlan.isFree ? 'Upgrade Now' : 'Change Plan';
      changePlanActions.push({
        content: changePlanLabel,
        to: '/account/billing/plan',
        Component: PageLink,
        color: 'orange',
      });
    }

    // TODO: Replace with data from the API
    const moneySpentOnCarbonOffsets = 22;
    const poundsOfCarbonOffset = (moneySpentOnCarbonOffsets / 11) * 2204.62;

    return (
      <div>
        <PendingPlanBanner account={account} subscription={billingSubscription} />
        <FreePlanWarningBanner account={account} accountAgeInDays={accountAgeInDays} />
        <Panel.LEGACY accent title="Plan Overview">
          <Panel.LEGACY.Section actions={changePlanActions}>
            <LabelledValue label="Your Plan">
              <PlanSummary plan={account.subscription} pendingCancellation={pending_cancellation} />
            </LabelledValue>
          </Panel.LEGACY.Section>
          {this.renderDedicatedIpSummarySection(isTransitioningToSelfServe)}
          {rvUsage && this.renderRecipientValidationSection({ rvUsage })}

          <Panel.LEGACY.Section
            actions={[
              { content: 'Get HTML Snippet', color: 'orange', onClick: this.handleCarbonModal },
            ]}
          >
            <LabelledValue
              label={
                <>
                  Carbon Offsets <Box as={Eco} marginTop="-3px" color="green.700" />
                </>
              }
            >
              <Bold>{poundsOfCarbonOffset}</Bold>
              <TranslatableText>&nbsp;pounds of carbon offset each month</TranslatableText>
            </LabelledValue>
          </Panel.LEGACY.Section>
        </Panel.LEGACY>

        {canUpdateBillingInfo && this.renderSummary()}

        {invoices.length > 0 && <InvoiceHistory invoices={this.props.invoices} />}

        <PremiumBanner />
        <EnterpriseBanner />

        <Modal.LEGACY open={!!show} onClose={this.handleModal}>
          {show === PAYMENT_MODAL && <UpdatePaymentForm onCancel={this.handleModal} />}
          {show === CONTACT_MODAL && <UpdateContactForm onCancel={this.handleModal} />}
          {show === IP_MODAL && <AddIps onClose={this.handleModal} />}
          {show === CARBON_OFFSET_MODAL && <CarbonOffsetModal onClose={this.handleModal} />}
        </Modal.LEGACY>
        <OGOnlyWrapper as={Modal.LEGACY} open={show === RV_MODAL} onClose={this.handleModal}>
          <Box
            as={Modal.LEGACY}
            open={show === RV_MODAL}
            onClose={this.handleModal}
            showCloseButton={true}
          >
            <RecipientValidationModal volumeUsed={volumeUsed} onClose={this.handleModal} />
          </Box>
        </OGOnlyWrapper>
      </div>
    );
  }
}

function CarbonOffsetModal({ onClose }) {
  const codeSnippet = `<table>
  <tr>
    <td style="width:16px">
      <img src="https://nicklemmon.com/leaf.png" alt="" role="presentation" height="auto" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;margin-top:-7px" />
    </td>
    <td align="left" style="font-size:0px;word-break:break-word;">
      <span style="font-family:sans-serif;font-size:15px;line-height:1;text-align:left;color:#55555B;">Carbon emissions from this email were automatically offset. Learn more at <a href="https://environment.sparkpost.com" title="Opens in a new tab" target="_blank">SparkPost.com</a></span>
    </td>
  </tr>
</table>`;
  const dispatch = useDispatch();

  function handleCopy() {
    copy();
    dispatch(showAlert({ type: 'success', message: 'HTML snippet copied' }));
    onClose();
  }

  function createMarkup() {
    return { __html: codeSnippet };
  }

  return (
    <Panel.LEGACY title="Carbon Offset HTML Snippet">
      <Panel.LEGACY.Section>
        <Stack>
          <p>
            Let your customers know you are doing good in the world - incorporate this snippet in to
            your content and show off your altruistic side:
          </p>

          <CodeBlock dark code={codeSnippet} />

          <Box backgroundColor="gray.200" padding="400">
            <Stack space="300">
              <Heading as="h4" looksLike="h5">
                HTML Preview
              </Heading>

              <Box dangerouslySetInnerHTML={createMarkup()} />
            </Stack>
          </Box>
        </Stack>
      </Panel.LEGACY.Section>

      <Panel.LEGACY.Section>
        <ButtonWrapper>
          <Button variant="primary" onClick={handleCopy}>
            <Box as="span" mr="200">
              Copy Snippet
            </Box>
            <Button.Icon as={ContentCopy} />
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </ButtonWrapper>
      </Panel.LEGACY.Section>
    </Panel.LEGACY>
  );
}
