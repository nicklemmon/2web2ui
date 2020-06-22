import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Panel } from 'src/components/matchbox';
import {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn,
} from 'src/actions/accountSingleSignOn';
import { ExternalLink } from 'src/components/links';
import { PanelLoading } from 'src/components/loading';
import { LINKS } from 'src/constants';
import ProviderSection from './ProviderSection';
import StatusSection from './StatusSection';
import SCIMTokenSection from './SCIMTokenSection';
import { PANEL_LOADING_HEIGHT } from 'src/pages/account/constants';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { generateScimToken, listScimToken, deleteScimToken } from 'src/actions/scimToken';

export function SingleSignOnPanel(props) {
  const {
    getAccountSingleSignOnDetails,
    provider,
    tfaRequired,
    isSsoScimUiEnabled,
    loading,
    listScimToken,
    generateScimToken,
    deleteScimToken,
    scimTokenList,
    newScimToken,
  } = props;
  useEffect(() => {
    getAccountSingleSignOnDetails();
  }, [getAccountSingleSignOnDetails]);
  useEffect(() => {
    if (isSsoScimUiEnabled) {
      listScimToken();
    }
  }, [isSsoScimUiEnabled, listScimToken]);

  const renderContent = () => {
    return (
      <React.Fragment>
        {tfaRequired && (
          <p>
            Single sign-on is not available while two-factor authentication is required on this
            account.
          </p>
        )}
        <ProviderSection readOnly={tfaRequired} provider={provider} />
        <StatusSection readOnly={tfaRequired} {...props} />
        {isSsoScimUiEnabled && provider && (
          <SCIMTokenSection
            scimTokenList={scimTokenList}
            newScimToken={newScimToken}
            generateScimToken={generateScimToken}
            listScimToken={listScimToken}
            deleteScimToken={deleteScimToken}
          />
        )}
      </React.Fragment>
    );
  };

  if (loading) {
    return <PanelLoading minHeight={PANEL_LOADING_HEIGHT} />;
  }

  return (
    <Panel
      title="Single Sign-On"
      actions={[
        {
          color: 'orange',
          component: ExternalLink,
          content: 'Learn More',
          to: LINKS.SSO_GUIDE,
        },
      ]}
    >
      {renderContent()}
    </Panel>
  );
}

const mapDispatchToProps = {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn,
  listScimToken,
  generateScimToken,
  deleteScimToken,
};

const mapStateToProps = state => ({
  ...state.accountSingleSignOn,
  tfaRequired: state.account.tfa_required,
  isSsoScimUiEnabled: isAccountUiOptionSet('sso_scim_section')(state),
  scimTokenList: state.scimToken.scimTokenList,
  newScimToken: state.scimToken.newScimToken,
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSignOnPanel);
