import React, { createContext, useContext } from 'react';
import { Expandable, Panel } from 'src/components/matchbox';
import { GUIDE_IDS } from 'src/constants';
import ShowMeSparkpostStep from './ShowMeSparkpostStep';
import LetsCodeStep from './LetsCodeStep';
import { useHibana } from 'src/context/HibanaContext';

export const GuideContext = createContext();
export const useGuideContext = () => useContext(GuideContext);

export const GettingStartedGuide = ({
  onboarding = {},
  history,
  setAccountOption,
  hasSendingDomains,
  hasApiKeysForSending,
  isAdmin,
  canManageKeys,
  canManageSendingDomains,
  canManageUsers,
}) => {
  const {
    send_test_email_completed,
    explore_analytics_completed,
    invite_collaborator_completed,
    view_developer_docs_completed,
    check_events_completed,
  } = onboarding;

  const setOnboardingAccountOption = (obj = {}) => {
    if (isAdmin) {
      setAccountOption('onboarding', obj);
    }
  };

  const [{ isHibanaEnabled }] = useHibana();

  const handleAction = action => {
    switch (action) {
      case 'Send Test Email':
        setOnboardingAccountOption({ send_test_email_completed: true });
        history.push(`/templates?appcue=${GUIDE_IDS.SEND_TEST_EMAIL}`);
        break;
      case 'Explore Analytics':
        setOnboardingAccountOption({ explore_analytics_completed: true });
        history.push(`/reports/summary`, { triggerGuide: true });
        break;
      case 'Check Out Events':
        setOnboardingAccountOption({ check_events_completed: true });
        history.push(`/reports/message-events`, { triggerGuide: true });
        break;
      case 'Invite a Collaborator':
        setOnboardingAccountOption({ invite_collaborator_completed: true });
        history.push('/account/users');
        break;
      case 'View Developer Docs':
        setOnboardingAccountOption({ view_developer_docs_completed: true });
        break;
      case 'Generate API Key':
        history.push('/account/api-keys');
        break;
      case 'Add Sending Domain':
        if (!isHibanaEnabled) history.push(`/account/sending-domains`, { triggerGuide: true });
        else history.push(`/domains/create`);
        break;
      default:
        break;
    }
  };

  const values = {
    setOnboardingAccountOption: setOnboardingAccountOption,
    send_test_email_completed: send_test_email_completed,
    explore_analytics_completed: explore_analytics_completed,
    invite_collaborator_completed: invite_collaborator_completed,
    check_events_completed: check_events_completed,
    hasSendingDomains: hasSendingDomains,
    hasApiKeysForSending: hasApiKeysForSending,
    view_developer_docs_completed: view_developer_docs_completed,
    handleAction: handleAction,
  };

  return (
    <GuideContext.Provider value={values}>
      <Panel.LEGACY title="Getting Started" sectioned>
        {canManageKeys && canManageSendingDomains && (
          <Expandable
            title="Start Sending with SparkPost"
            my="300"
            defaultOpen
            id="start_sending_expandable"
          >
            <LetsCodeStep />
          </Expandable>
        )}
        <Expandable title="SparkPost Analytics" my="300" id="sparkpost_analytics">
          <ShowMeSparkpostStep canManageUsers={canManageUsers} />
        </Expandable>
      </Panel.LEGACY>
    </GuideContext.Provider>
  );
};
