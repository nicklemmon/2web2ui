import React, { useEffect } from 'react';
import { Code, ChatBubble, LightbulbOutline } from '@sparkpost/matchbox-icons';
import SendingMailWebp from '@sparkpost/matchbox-media/images/Sending-Mail.webp';
import SendingMail from '@sparkpost/matchbox-media/images/Sending-Mail@medium.jpg';
import { Loading } from 'src/components';
import {
  Box,
  Button,
  Columns,
  Column,
  Layout,
  Panel,
  Picture,
  ScreenReaderOnly,
  Stack,
  Text,
} from 'src/components/matchbox';
import { Heading, TranslatableText } from 'src/components/text';
import { ExternalLink, PageLink, SupportTicketLink } from 'src/components/links';
import useDashboardContext from './hooks/useDashboardContext';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

export default function DashboardPageV2() {
  const {
    getAccount,
    listAlerts,
    getUsage,
    currentUser,
    pending,
    hasSetupDocumentationPanel,
    addSendingDomainOnboarding,
    hasUsageSection,
  } = useDashboardContext();

  useEffect(() => {
    getAccount({ include: 'usage' });
    listAlerts();
    if (hasUsageSection) {
      getUsage(); // this is needed to display the rv usage section which should only be visible to admins
    }
    // eslint-disable-next-line
  }, []);

  if (pending) return <Loading />;

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
              <Dashboard.Panel>
                <ScreenReaderOnly>
                  <Heading as="h3">Next Steps</Heading>
                </ScreenReaderOnly>

                {addSendingDomainOnboarding && (
                  <Columns>
                    <Column>
                      <Panel.Section>
                        <Panel.Headline>
                          <TranslatableText>Get Started!</TranslatableText>
                        </Panel.Headline>
                        <Text pb="600">
                          At least one verified sending domain is required in order to start sending
                          or enable analytics.
                        </Text>
                        <PageLink
                          variant="primary"
                          size="default"
                          color="blue"
                          to="/domains"
                          as={Button}
                        >
                          Add Sending Domain
                        </PageLink>
                      </Panel.Section>
                    </Column>
                    <Box as={Column} display={['none', 'none', 'block']} width={[0, 0, 0.55]}>
                      <Box height="100%">
                        <Picture role="presentation">
                          <source srcset={SendingMailWebp} type="image/webp" />
                          <Picture.Image alt="" src={SendingMail} seeThrough />
                        </Picture>
                      </Box>
                    </Box>
                  </Columns>
                )}
              </Dashboard.Panel>

              <Dashboard.Panel>
                <Panel.Section>
                  <Panel.Headline>
                    <Panel.HeadlineIcon as={LightbulbOutline} />
                    <TranslatableText>Helpful Shortcuts</TranslatableText>
                  </Panel.Headline>

                  <Columns collapseBelow="md">
                    <Dashboard.Tip>
                      <PageLink to="/templates">Templates</PageLink>

                      {/* TODO: Replace placeholder content */}
                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Tip>

                    <Dashboard.Tip>
                      {/* TODO: Where does this go? */}
                      <PageLink to="/">DKIM Authentication</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Tip>

                    <Dashboard.Tip>
                      {/* TODO: Where does this go? */}
                      <PageLink to="/">SMTP Set-up</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Tip>
                  </Columns>
                </Panel.Section>
              </Dashboard.Panel>

              <Columns collapseBelow="md" space="500">
                {hasSetupDocumentationPanel && (
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
                )}

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

                {/* Used to shift the "Need Help?" Panel to align to the left */}
                {!hasSetupDocumentationPanel && <Column />}
              </Columns>
            </Stack>
          </Layout.Section>

          <Layout.Section annotated>
            <Sidebar>
              <Sidebar.AccountDetails />
              <Sidebar.BillingUsage />
              <Sidebar.RecentAlerts />
            </Sidebar>
          </Layout.Section>
        </Layout>
      </Stack>
    </Dashboard>
  );
}
