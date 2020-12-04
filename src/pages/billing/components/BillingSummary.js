import React, { useState, useRef, Component } from 'react';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Editor from '@monaco-editor/react';
import { ContentCopy, Eco } from '@sparkpost/matchbox-icons';
import copy from 'copy-to-clipboard';
import { LabelledValue, ButtonWrapper } from 'src/components';
import { ExternalLink, PageLink } from 'src/components/links';
import {
  Box,
  Button,
  Columns,
  Column,
  Expandable,
  LabelValue,
  Panel,
  Modal,
  Stack,
  Text,
} from 'src/components/matchbox';
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

const PAYMENT_MODAL = 'payment';
const CONTACT_MODAL = 'contact';
const IP_MODAL = 'ip';
const RV_MODAL = 'recipient_validation';
const CARBON_OFFSET_DETAILS_MODAL = 'carbon_offset_deatils_modal';
const CARBON_OFFSET_HTML_MODAL = 'carbon_offset_html_modal';

const CLOVERLY_API_RES = {
  slug: '20201203-31027b7d0e60c3e0666c6129d4c2600f',
  environment: 'sandbox',
  state: 'purchased',
  renewable_energy_certificate: {
    slug: 'soma-iii-wind-farm-12-months-starting-01-2016-8311f6',
    name: 'Soma III Wind Farm - 12 months starting 01/2020',
    city: 'Soma',
    province: 'Manisa',
    country: 'Turkey',
    renewable_type: 'wind',
    total_capacity: '100 megawatts',
    latlng: {
      x: 39.18,
      y: 27.6,
    },
    technical_details:
      'The mountainous terrain of Turkey\'s Manisa Province lends itself perfectly to wind power. In general, the higher the altitude, the stronger and more reliable the wind. The town of Soma, 45 miles east of the Aegean Sea in northwestern Turkey, sits at an elevation of 528 feet, with higher peaks around it. Wind turbines stand atop many of those peaks. The Soma Wind Farm, built in four (so far) phases, encompasses 181 turbines with a total capacity of 288 megawatts.\r\n\r\nSoma III (50 turbines, 100 MW) came online in 2015. Turkey currently gets 34% of its electricity from plants powered by imported fuels. Its potential wind resources are among the best in Eurasia, so wind power has become an important part of its plan for energy independence. Soma III generates about 280 megawatt-hours of power each year. That avoids the emission of about 167,000 metric tons (184,086 US tons) of carbon dioxide equivalents that would have come from generating that amount of power by conventional means.\r\n\r\nThe emission credits representing that avoided carbon impact are called verified emission reductions. Each VER represents the avoidance of 1 metric ton (2,205 pounds) of carbon dioxide emissions.\r\n\r\nCloverly buys offsets that meet accepted standards for being real, measurable, verifiable, permanent, and additional. "Additional" means that the carbon savings would not have happened without the offset project and that the project would not have happened unless it got certified to sell carbon offsets. Gold Standard oversees verification of the Soma III Wind Farm. You can find verification documents at https://impact.sustain-cert.com/public_projects/571.\r\n\r\nProjects can produce many offsets during a year. So a project may appear more than once in the Cloverly portfolio. You can tell the year of the offset by the date in the web address for each project: "12-months-starting-[month]-[year]." For a list of all the projects in our portfolio and an interactive map, see https://cloverly.com/offset-map. Learn more about Cloverly at https://cloverly.com.',
    deprecated:
      'Use the offsets attribute. The renewable_energy_certificate attribute will be removed in the next version.',
  },
  micro_rec_count: 740000,
  micro_units: 740000,
  offset: {
    slug: 'soma-iii-wind-farm-12-months-starting-01-2016-8311f6',
    name: 'Soma III Wind Farm - 12 months starting 01/2016',
    pretty_name: 'Soma III Wind Farm',
    city: 'Soma',
    province: 'Manisa',
    country: 'Turkey',
    offset_type: 'Wind',
    offset_type_slug: 'wind',
    total_capacity: '100 megawatts',
    latlng: {
      x: 39.18,
      y: 27.6,
    },
    technical_details:
      'The mountainous terrain of Turkey\'s Manisa Province lends itself perfectly to wind power. In general, the higher the altitude, the stronger and more reliable the wind. The town of Soma, 45 miles east of the Aegean Sea in northwestern Turkey, sits at an elevation of 528 feet, with higher peaks around it. Wind turbines stand atop many of those peaks. The Soma Wind Farm, built in four (so far) phases, encompasses 181 turbines with a total capacity of 288 megawatts.\r\n\r\nSoma III (50 turbines, 100 MW) came online in 2015. Turkey currently gets 34% of its electricity from plants powered by imported fuels. Its potential wind resources are among the best in Eurasia, so wind power has become an important part of its plan for energy independence. Soma III generates about 280 megawatt-hours of power each year. That avoids the emission of about 167,000 metric tons (184,086 US tons) of carbon dioxide equivalents that would have come from generating that amount of power by conventional means.\r\n\r\nThe emission credits representing that avoided carbon impact are called verified emission reductions. Each VER represents the avoidance of 1 metric ton (2,205 pounds) of carbon dioxide emissions.\r\n\r\nCloverly buys offsets that meet accepted standards for being real, measurable, verifiable, permanent, and additional. "Additional" means that the carbon savings would not have happened without the offset project and that the project would not have happened unless it got certified to sell carbon offsets. Gold Standard oversees verification of the Soma III Wind Farm. You can find verification documents at https://impact.sustain-cert.com/public_projects/571.\r\n\r\nProjects can produce many offsets during a year. So a project may appear more than once in the Cloverly portfolio. You can tell the year of the offset by the date in the web address for each project: "12-months-starting-[month]-[year]." For a list of all the projects in our portfolio and an interactive map, see https://cloverly.com/offset-map. Learn more about Cloverly at https://cloverly.com.',
    available_carbon_in_kg: 785200.349,
    pretty_url:
      'https://dashboard.cloverly.com/offsets/soma-iii-wind-farm-12-months-starting-01-2016-8311f6',
  },
  total_cost_in_usd_cents: 173,
  estimated_at: '2020-12-03T21:41:04.443Z',
  purchased_at: '2020-12-03T21:42:05.481Z',
  equivalent_carbon_in_kg: 740.0,
  electricity_in_kwh: 0.0,
  rec_cost_in_usd_cents: 148,
  transaction_cost_in_usd_cents: 25,
  pretty_url: 'https://dashboard.cloverly.com/receipt/20201203-31027b7d0e60c3e0666c6129d4c2600f',
};

export default class BillingSummary extends Component {
  state = {
    show: false,
  };

  handleModal = (modal = false) => {
    this.setState({ show: this.state.show ? false : modal });
  };

  handlePaymentModal = () => this.handleModal(PAYMENT_MODAL);
  handleContactModal = () => this.handleModal(CONTACT_MODAL);
  handleCarbonHtmlModal = () => this.handleModal(CARBON_OFFSET_HTML_MODAL);
  handleCarbonDetailsModal = () => this.handleModal(CARBON_OFFSET_DETAILS_MODAL);
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

          <CarbonSection
            handleCarbonDetailsModal={this.handleCarbonDetailsModal}
            handleCarbonHtmlModal={this.handleCarbonHtmlModal}
          />
        </Panel.LEGACY>

        {canUpdateBillingInfo && this.renderSummary()}

        {invoices.length > 0 && <InvoiceHistory invoices={this.props.invoices} />}

        <PremiumBanner />
        <EnterpriseBanner />

        <Modal.LEGACY open={!!show} onClose={this.handleModal}>
          {show === PAYMENT_MODAL && <UpdatePaymentForm onCancel={this.handleModal} />}
          {show === CONTACT_MODAL && <UpdateContactForm onCancel={this.handleModal} />}
          {show === IP_MODAL && <AddIps onClose={this.handleModal} />}
          {show === CARBON_OFFSET_HTML_MODAL && (
            <CarbonOffsetHtmlSnippetModal onClose={this.handleModal} />
          )}
          {show === CARBON_OFFSET_DETAILS_MODAL && (
            <CarbonOffsetDetailsModal onClose={this.handleModal} />
          )}
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

function CarbonSection({ handleCarbonDetailsModal, handleCarbonHtmlModal }) {
  const { search } = useLocation();
  const { green_plan } = qs.parse(search.slice(1));
  const moneySpentOnCarbonOffsets = 22;
  const poundsOfCarbonOffset = (moneySpentOnCarbonOffsets / 11) * 2204.62;

  if (!green_plan) return null;

  return (
    <Panel.LEGACY.Section
      actions={[
        { content: 'View Details', color: 'orange', onClick: handleCarbonDetailsModal },
        { content: 'Get HTML Snippet', color: 'orange', onClick: handleCarbonHtmlModal },
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
  );
}

function CarbonOffsetDetailsModal({ onClose }) {
  return (
    <Panel.LEGACY title="Carbon Offset Details">
      <Panel.LEGACY.Section>
        <Stack>
          <p>
            When purchasing carbon offsets, a certificate is provided via our partner provider,
            Cloverly, with additional detail regarding your carbon offset purchase.
          </p>

          <Expandable
            title={CLOVERLY_API_RES.offset.pretty_name}
            subtitle="Learn more about your purchased Carbon offset"
            id="carbon-offset-details"
          >
            <Text color="gray.700">{CLOVERLY_API_RES.offset.technical_details}</Text>
          </Expandable>

          <Columns>
            <Column>
              <LabelValue>
                <LabelValue.Label>Offset Type</LabelValue.Label>
                <LabelValue.Value>{CLOVERLY_API_RES.offset.offset_type}</LabelValue.Value>
              </LabelValue>
            </Column>

            <Column>
              <LabelValue>
                <LabelValue.Label>Site Energy Capacity</LabelValue.Label>
                <LabelValue.Value>{CLOVERLY_API_RES.offset.total_capacity}</LabelValue.Value>
              </LabelValue>
            </Column>
          </Columns>

          <ExternalLink to={CLOVERLY_API_RES.pretty_url}>View Cloverly Dashboard</ExternalLink>
        </Stack>
      </Panel.LEGACY.Section>

      <Panel.LEGACY.Section>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Panel.LEGACY.Section>
    </Panel.LEGACY>
  );
}

function CarbonOffsetHtmlSnippetModal({ onClose }) {
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
  const [isEditorReady, setIsEditorReady] = useState(false);
  const valueGetter = useRef();
  const dispatch = useDispatch();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  function handleCopy() {
    copy(valueGetter.current());
    dispatch(showAlert({ type: 'success', message: 'HTML snippet copied' }));
    onClose();
  }

  function createMarkup() {
    return { __html: valueGetter.current() };
  }

  return (
    <Panel.LEGACY title="Carbon Offset HTML Snippet">
      <Panel.LEGACY.Section>
        <Stack>
          <p>
            Let your customers know you are doing good in the world - incorporate this snippet in to
            your content and show off your altruistic side:
          </p>

          <Box
            as={Editor}
            paddingTop="25px"
            backgroundColor="#202124"
            height="300px"
            language="html"
            value={codeSnippet}
            theme="dark"
            options={{
              fontSize: '15px',
              minimap: {
                enabled: false,
              },
            }}
            editorDidMount={handleEditorDidMount}
          />

          <Box backgroundColor="gray.200" padding="400">
            <Stack space="300">
              <Heading as="h4" looksLike="h5">
                Default Message Preview
              </Heading>

              {isEditorReady ? <Box dangerouslySetInnerHTML={createMarkup()} /> : null}
            </Stack>
          </Box>
        </Stack>
      </Panel.LEGACY.Section>

      <Panel.LEGACY.Section>
        <ButtonWrapper>
          <Button variant="primary" onClick={handleCopy} disabled={!isEditorReady}>
            <Box as="span" mr="200">
              Copy HTML
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
