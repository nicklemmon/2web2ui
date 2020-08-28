import React from 'react';
import { Panel, Box } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import { GuideListItem, GuideListItemTitle, GuideListItemDescription } from './GuideListItem';
import { useGuideContext } from './GettingStartedGuide';

const SendTestEmailItem = () => {
  const { send_test_email_completed, handleAction } = useGuideContext();
  return (
    <GuideListItem
      action={{
        name: 'Send Test Email',
        onClick: () => handleAction('Send Test Email'),
      }}
      itemCompleted={send_test_email_completed}
    >
      <GuideListItemTitle>Send a Test Email</GuideListItemTitle>
      <GuideListItemDescription>
        Send a test email using our starter template.
      </GuideListItemDescription>
    </GuideListItem>
  );
};

const ExploreAnalyticsItem = () => {
  const { explore_analytics_completed, handleAction } = useGuideContext();

  return (
    <GuideListItem
      action={{
        name: 'Explore Analytics',
        onClick: () => handleAction('Explore Analytics'),
      }}
      itemCompleted={explore_analytics_completed}
    >
      <GuideListItemTitle>Explore Analytics</GuideListItemTitle>
      <GuideListItemDescription>
        Get acquainted with our powerful analytics to make the most of your sending strategy.
      </GuideListItemDescription>
    </GuideListItem>
  );
};

const ViewEventsItem = () => {
  const { check_events_completed, handleAction } = useGuideContext();

  return (
    <GuideListItem
      action={{
        name: 'Check Out Events',
        onClick: () => handleAction('Check Out Events'),
      }}
      itemCompleted={check_events_completed}
    >
      <GuideListItemTitle>Check Out Events</GuideListItemTitle>
      <GuideListItemDescription>
        Learn how SparkPost can provide analytics to make the most of your sending strategy.
      </GuideListItemDescription>
    </GuideListItem>
  );
};

const InviteCollaboratorItem = () => {
  const { invite_collaborator_completed, handleAction } = useGuideContext();

  return (
    <GuideListItem
      action={{
        name: 'Invite a Collaborator',
        onClick: () => handleAction('Invite a Collaborator'),
      }}
      itemCompleted={invite_collaborator_completed}
    >
      <GuideListItemTitle>Invite Your Team</GuideListItemTitle>
      <GuideListItemDescription>
        <span>
          Need help integrating? Pass the ball on to someone else to finish setting up this account.
        </span>
      </GuideListItemDescription>
    </GuideListItem>
  );
};

export function HibanaShowMeSparkpostStep(props) {
  return (
    <>
      <Box mx="400" mb="400">
        <SendTestEmailItem />
      </Box>
      <Box mx="400" mb="400">
        <ExploreAnalyticsItem />
      </Box>
      <Box mx="400" mb="400">
        <ViewEventsItem />
      </Box>
      {props.canManageUsers && (
        <Box mx="400" mb="400">
          <InviteCollaboratorItem />
        </Box>
      )}
    </>
  );
}

export function OGShowMeSparkpostStep(props) {
  return (
    <>
      <Panel.LEGACY.Section>
        <SendTestEmailItem />
      </Panel.LEGACY.Section>
      <Panel.LEGACY.Section>
        <ExploreAnalyticsItem />
      </Panel.LEGACY.Section>
      <Panel.LEGACY.Section>
        <ViewEventsItem />
      </Panel.LEGACY.Section>
      {props.canManageUsers && (
        <Panel.LEGACY.Section>
          <InviteCollaboratorItem />
        </Panel.LEGACY.Section>
      )}
    </>
  );
}

function ShowMeSparkpostStep(props) {
  return useHibanaToggle(OGShowMeSparkpostStep, HibanaShowMeSparkpostStep)(props);
}

export default ShowMeSparkpostStep;
