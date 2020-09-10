import React, { useEffect } from 'react';
import { Code, ChatBubble, LightbulbOutline } from '@sparkpost/matchbox-icons';
import ConfigurationImgWebp from '@sparkpost/matchbox-media/images/Configuration.webp';
import ConfigurationImg from '@sparkpost/matchbox-media/images/Configuration@small.jpg';
import { Loading, Picture } from 'src/components';
import {
  Box,
  Columns,
  Column,
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
import Sidebar from './components/Sidebar';

export default function DashboardPageV2() {
  const {
    getAccount,
    listAlerts,
    getUsage,
    currentUser,
    pending,
    hasSetupDocumentationPanel,
    hasAddSendingDomainLink,
    hasGenerateApiKeyLink,
  } = useDashboardContext();

  useEffect(() => {
    getAccount({ include: 'usage' });
    getUsage();
    listAlerts();
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
              </Columns>

              <Dashboard.Panel>
                <Panel.Section>
                  <Panel.Headline>
                    <Panel.HeadlineIcon as={LightbulbOutline} />

                    <TranslatableText>Helpful Shortcuts</TranslatableText>
                  </Panel.Headline>

                  <Columns collapseBelow="md">
                    <Dashboard.Tip>
                      <PageLink to="/account/api-keys/create">Generate an API Key</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Tip>

                    <Dashboard.Tip>
                      <PageLink to="/">DKIM Authentication</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Tip>

                    <Dashboard.Tip>
                      <PageLink to="/alerts/create">Create an Alert</PageLink>

                      <Text>
                        Get up and sending quickly using our sample templates. AMP for email, Yes we
                        have it.
                      </Text>
                    </Dashboard.Tip>
                  </Columns>
                </Panel.Section>
              </Dashboard.Panel>

              <Dashboard.Panel>
                <ScreenReaderOnly>
                  <Heading as="h3">Next Steps</Heading>
                </ScreenReaderOnly>

                <Columns space="0">
                  <Box as={Column} display={['none', 'none', 'block']} width={[0, 0, 0.55]}>
                    <Box backgroundColor="gray.100" height="100%" borderRight="400">
                      <Picture role="presentation">
                        <Picture.Source srcSet={ConfigurationImgWebp} type="image/webp" />

                        <Picture.Img src={ConfigurationImg} alt="" seeThrough />
                      </Picture>
                    </Box>
                  </Box>

                  <Column>
                    {hasAddSendingDomainLink && (
                      <Dashboard.Shortcut to="/account/sending-domains/create">
                        Add a Sending Domain
                      </Dashboard.Shortcut>
                    )}

                    {hasGenerateApiKeyLink && (
                      <Dashboard.Shortcut to="/account/api-keys/create">
                        Generate an API Key
                      </Dashboard.Shortcut>
                    )}

                    <Dashboard.Shortcut to="/signals/analytics">
                      Analyze your Data
                    </Dashboard.Shortcut>

                    <Dashboard.Shortcut to="/alerts/create">Create an Alert</Dashboard.Shortcut>
                  </Column>
                </Columns>
              </Dashboard.Panel>
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
