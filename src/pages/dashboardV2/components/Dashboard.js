import React from 'react';
import { tokens } from '@sparkpost/design-tokens-hibana';
import styled from 'styled-components';
import { ChevronRight } from '@sparkpost/matchbox-icons';
import { Box, Column, Page, Panel, Stack, Text } from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import { Heading } from 'src/components/text';

const ShortcutLink = styled(PageLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.space['500']};
  text-decoration: none;
  background-color: #fff;
  border-bottom: 1px solid ${props => props.theme.colors.gray['400']};
  box-shadow: 0 1px ${props => props.theme.colors.gray['400']}; /* This is a hacky-ish way to address bottom borders when the container isn't full */
  transition-property: background-color;
  transition-duration: ${tokens.motionDuration_fast}; /* TODO: These should be supplied by the theme through props but aren't - filed ticket -> https://github.com/SparkPost/matchbox/issues/608 */

  &:last-of-type {
    border-bottom: 0;
  }

  &:hover {
    background-color: ${props => props.theme.colors.gray['300']};
  }
`;

function Dashboard({ children }) {
  return <Page>{children}</Page>;
}

function DashboardHeading({ children }) {
  return (
    <Heading as="h2">
      <Text fontWeight="normal" as="span">
        {children}
      </Text>
    </Heading>
  );
}

function DashboardPanel({ children, ...props }) {
  return (
    <Panel marginBottom="0" {...props}>
      {children}
    </Panel>
  );
}

function Tip({ children }) {
  return (
    <Column>
      <Stack space="200">{children}</Stack>
    </Column>
  );
}

function Shortcut({ children, to }) {
  return (
    <ShortcutLink to={to}>
      <Text color="gray.900" fontSize="400" fontWeight="600" lineHeight="400">
        {children}
      </Text>

      <Box as={ChevronRight} color="blue.700" size={24} />
    </ShortcutLink>
  );
}

DashboardHeading.displayName = 'Dashboard.Heading';
DashboardPanel.displayName = 'Dashboard.Panel';
Tip.displayName = 'Dashboard.Tip';
Shortcut.displayName = 'Dashboard.Shortcut';

Dashboard.Heading = DashboardHeading;
Dashboard.Panel = DashboardPanel;
Dashboard.Tip = Tip;
Dashboard.Shortcut = Shortcut;

export default Dashboard;
