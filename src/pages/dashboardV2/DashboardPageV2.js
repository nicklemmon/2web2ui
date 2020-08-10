import React from 'react';
import { Code, ChatBubble, LightbulbOutline } from '@sparkpost/matchbox-icons';
import {
  Column,
  Columns,
  Layout,
  Panel,
  ScreenReaderOnly,
  Stack,
  Text,
} from 'src/components/matchbox';
import { Heading, TranslatableText } from 'src/components/text';
import { ExternalLink, PageLink, SupportTicketLink } from 'src/components/links';
import useDashboardContext from './hooks/useDashboardContext';
import Dashboard from './components/Dashboard';

export default function DashboardPageV2() {
  const { currentUser } = useDashboardContext();

  return (
    <Dashboard>
      <ScreenReaderOnly>
        <Heading as="h1">Dashboard</Heading>
      </ScreenReaderOnly>

      <Stack>
        {currentUser?.first_name && (
          <Dashboard.Heading>
            <TranslatableText>Welcome, </TranslatableText>
            {currentUser.first_name}!
          </Dashboard.Heading>
        )}

        <Layout>
          <Layout.Section>
            <Stack>
              <Columns collapseBelow="md" space="500">
                <Column>
                  <Dashboard.Panel>
                    <Panel.Section>
                      <Panel.Headline>
                        <Panel.HeadlineIcon as={Code} />

                        <TranslatableText>Setup Documentation</TranslatableText>
                      </Panel.Headline>

                      <ExternalLink to="/">Integration Documentation</ExternalLink>
                    </Panel.Section>
                  </Dashboard.Panel>
                </Column>

                <Column>
                  <Dashboard.Panel>
                    <Panel.Section>
                      <Panel.Headline>
                        <Panel.HeadlineIcon as={ChatBubble} />

                        <TranslatableText>Need Help?</TranslatableText>
                      </Panel.Headline>

                      <SupportTicketLink>Contact our Support Team</SupportTicketLink>
                    </Panel.Section>
                  </Dashboard.Panel>
                </Column>
              </Columns>

              <Dashboard.Panel>
                <Panel.Section>
                  <Panel.Headline>
                    <Panel.HeadlineIcon as={LightbulbOutline} />

                    <TranslatableText>Helpful Shortcuts</TranslatableText>
                  </Panel.Headline>

                  <Columns collapseBelow="md">
                    <Dashboard.Shortcut>
                      <PageLink to="/api-keys/create">Generate an API Key</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Shortcut>

                    <Dashboard.Shortcut>
                      <PageLink to="/">DKIM Authentication</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Shortcut>

                    <Dashboard.Shortcut>
                      <PageLink to="/alerts/create">Create an Alert</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Shortcut>
                  </Columns>
                </Panel.Section>
              </Dashboard.Panel>
            </Stack>
          </Layout.Section>

          <Layout.Section annotated>
            <Stack>
              <Layout.SectionTitle as="h3">Account Details</Layout.SectionTitle>

              <Layout.SectionTitle as="h3">Billing/Usage Detail</Layout.SectionTitle>
            </Stack>
          </Layout.Section>
        </Layout>
      </Stack>
    </Dashboard>
  );
}
