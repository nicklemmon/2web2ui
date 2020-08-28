import React from 'react';
import { Panel, Box } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import { GuideListItem, GuideListItemTitle, GuideListItemDescription } from './GuideListItem';
import { useGuideContext } from './GettingStartedGuide';
import { Abbreviation } from 'src/components';

const AddSendingDomainItem = () => {
  const { hasSendingDomains, handleAction } = useGuideContext();
  return (
    <GuideListItem
      action={{
        name: 'Add Sending Domain',
        onClick: () => handleAction('Add Sending Domain'),
      }}
      itemCompleted={hasSendingDomains}
    >
      <GuideListItemTitle>Add a Sending Domain</GuideListItemTitle>
      <GuideListItemDescription>
        You'll need to add a sending domain in order to start sending emails.
      </GuideListItemDescription>
    </GuideListItem>
  );
};

const GenerateApiKeyItem = () => {
  const { hasApiKeysForSending, handleAction } = useGuideContext();

  return (
    <GuideListItem
      action={{
        name: 'Generate API Key',
        onClick: () => handleAction('Generate API Key'),
      }}
      itemCompleted={hasApiKeysForSending}
    >
      <GuideListItemTitle>Generate an API Key</GuideListItemTitle>
      <GuideListItemDescription>
        An API Key is required to use our APIs within your app.
      </GuideListItemDescription>
    </GuideListItem>
  );
};

const ViewDeveloperDocsItem = () => {
  const { view_developer_docs_completed, handleAction } = useGuideContext();

  return (
    <GuideListItem
      action={{
        name: 'View Developer Docs',
        onClick: () => handleAction('View Developer Docs'),
        to: 'https://developers.sparkpost.com/api',
        external: true,
      }}
      itemCompleted={view_developer_docs_completed}
    >
      <GuideListItemTitle>Check Out the Documentation</GuideListItemTitle>
      <GuideListItemDescription>
        <span>Visit our developer docs for all the details on our&nbsp;</span>
        <Abbreviation title="Application Programming Interface">API</Abbreviation>
        <span>&nbsp;and&nbsp;</span>
        <Abbreviation title="Simple Mail Transfer Protocol">SMTP</Abbreviation>
        <span>&nbsp;powered delivery.</span>
      </GuideListItemDescription>
    </GuideListItem>
  );
};

export function OGLetsCodeStep() {
  return (
    <>
      <Panel.LEGACY.Section>
        <AddSendingDomainItem />
      </Panel.LEGACY.Section>
      <Panel.LEGACY.Section>
        <GenerateApiKeyItem />
      </Panel.LEGACY.Section>
      <Panel.LEGACY.Section>
        <ViewDeveloperDocsItem />
      </Panel.LEGACY.Section>
    </>
  );
}

export function HibanaLetsCodeStep() {
  return (
    <>
      <Box mx="400" mb="400">
        <AddSendingDomainItem />
      </Box>
      <Box mx="400" mb="400">
        <GenerateApiKeyItem />
      </Box>
      <Box mx="400" mb="400">
        <ViewDeveloperDocsItem />
      </Box>
    </>
  );
}

function LetsCodeStep(props) {
  return useHibanaToggle(OGLetsCodeStep, HibanaLetsCodeStep)(props);
}

export default LetsCodeStep;
