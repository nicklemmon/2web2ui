import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { update } from 'src/actions/sendingDomains';

import { Help } from '@sparkpost/matchbox-icons';
import { SubduedText } from 'src/components/text';
import { PageLink } from 'src/components/links';
import { Banner, Panel, Tooltip } from 'src/components/matchbox';
import { ToggleBlock } from 'src/components/toggleBlock';
import { SendingDomainSection } from './SendingDomainSection';
import { resolveReadyFor } from 'src/helpers/domains';
import BounceSetupInstructionContainer from './BounceSetupInstruction.container';

import {
  hasAutoVerifyEnabledSelector,
  selectAllowDefaultBounceDomains,
  selectAllSubaccountDefaultBounceDomains,
} from 'src/selectors/account';

export class EditBounce extends Component {
  toggleDefaultBounce = () => {
    const { id, update, domain, reset } = this.props;

    return update({
      id,
      subaccount: domain.subaccount_id,
      is_default_bounce_domain: !domain.is_default_bounce_domain,
    }).catch(err => {
      // TODO: Switch this single field form to use ToggleBlock without Redux Form and set the value
      //   of the toggle from the store value, so this catch can be removed
      reset();
      throw err; // for error reporting
    });
  };

  renderRootDomainWarning() {
    const { id } = this.props;
    const host = id.split('.');
    if (host.length >= 3) {
      return null;
    }

    return (
      <Banner status="warning" marginBottom="500">
        <p>
          We strongly recommend using a subdomain such as <strong>bounces.{id}</strong> for bounce
          domains.
        </p>

        <Banner.Actions>
          <PageLink to="/account/sending-domains/create">Create a new domain now.</PageLink>
        </Banner.Actions>
      </Banner>
    );
  }

  renderNotReady() {
    const { domain } = this.props;

    return (
      <Fragment>
        <SendingDomainSection.Left>
          <SubduedText mt="300">
            To use this domain for bounces, connect your domain by setting the required DNS
            record(s) and verifying the connection.
          </SubduedText>
        </SendingDomainSection.Left>
        <SendingDomainSection.Right>
          {this.renderRootDomainWarning()}
          <BounceSetupInstructionContainer domain={domain} />
        </SendingDomainSection.Right>
      </Fragment>
    );
  }

  renderReady() {
    const { domain, id, updateLoading, allowDefault, allowSubaccountDefault } = this.props;
    const readyFor = resolveReadyFor(domain.status);

    // Allow default bounce toggle if:
    // Config flag is true
    // Domain is verified
    // Domain is ready for bounce
    // Bounce domain by subaccount config flag is true
    const showDefaultBounceSubaccount =
      !domain.subaccount_id || (domain.subaccount_id && allowSubaccountDefault);
    const showDefaultBounceToggle =
      allowDefault && readyFor.sending && readyFor.bounce && showDefaultBounceSubaccount;

    const tooltip = (
      <Tooltip
        id="sending-domains-edit-bounce-tooltip"
        dark
        content={`When this is set to "ON", all future transmissions ${
          domain.subaccount_id ? 'for this subaccount ' : ''
        }will use ${id} as their bounce domain (unless otherwise specified).`}
      >
        Default bounce domain {domain.subaccount_id && ` for Subaccount ${domain.subaccount_id}`}
        <Help size={15} />
      </Tooltip>
    );

    return (
      <Fragment>
        <SendingDomainSection.Left />
        <SendingDomainSection.Right>
          {this.renderRootDomainWarning()}
          <BounceSetupInstructionContainer domain={domain} />
          {showDefaultBounceToggle && (
            <Panel.LEGACY sectioned>
              <Field
                name="is_default_bounce_domain"
                component={ToggleBlock}
                label={tooltip}
                type="checkbox"
                parse={value => !!value} // Prevents unchecked value from equaling ""
                disabled={updateLoading}
                onChange={this.toggleDefaultBounce}
              />
            </Panel.LEGACY>
          )}
        </SendingDomainSection.Right>
      </Fragment>
    );
  }

  render() {
    const { domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);

    return (
      <SendingDomainSection title="Set Up For Bounce">
        {readyFor.bounce ? this.renderReady() : this.renderNotReady()}
      </SendingDomainSection>
    );
  }
}

const formOptions = {
  form: 'sendingDomainBounce',
  enableReinitialize: true, // required to update initial values from redux state
};

const mapStateToProps = (state, { domain }) => ({
  hasAutoVerifyEnabled: hasAutoVerifyEnabledSelector(state),
  allowDefault: selectAllowDefaultBounceDomains(state),
  allowSubaccountDefault: selectAllSubaccountDefaultBounceDomains(state),
  updateLoading: state.sendingDomains.updateLoading,
  initialValues: {
    ...domain,
  },
});

export default connect(mapStateToProps, { update })(reduxForm(formOptions)(EditBounce));
