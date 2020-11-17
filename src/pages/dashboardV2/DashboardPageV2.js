import React, { useEffect } from 'react';
import { Code, ChatBubble, LightbulbOutline } from '@sparkpost/matchbox-icons';
import SendingMailWebp from '@sparkpost/matchbox-media/images/Sending-Mail.webp';
import SendingMail from '@sparkpost/matchbox-media/images/Sending-Mail@medium.jpg';
import ConfigurationWebp from '@sparkpost/matchbox-media/images/Configuration.webp';
import Configuration from '@sparkpost/matchbox-media/images/Configuration@medium.jpg';
import { Loading, Abbreviation } from 'src/components';
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
import { Bold, Heading, TranslatableText } from 'src/components/text';
import { ExternalLink, PageLink, SupportTicketLink } from 'src/components/links';
import useDashboardContext from './hooks/useDashboardContext';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { LINKS } from 'src/constants';
import styled from 'styled-components';

const OnboardingPicture = styled(Picture.Image)`
  vertical-align: bottom;
`;

export default function DashboardPageV2() {
  const {
    getAccount,
    listAlerts,
    getUsage,
    verifySendingLink,
    onboarding,
    isAnAdmin,
    isDev,
    currentUser,
    pending,
    listSendingDomains,
    listApiKeys,
  } = useDashboardContext();
  const hasSetupDocumentationPanel = isAnAdmin || isDev;

  useEffect(() => {
    getAccount({ include: 'usage' });
    listAlerts();
    getUsage();
    listSendingDomains();
    listApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {onboarding !== 'fallback' && onboarding !== undefined && (
                <Dashboard.Panel>
                  {onboarding === 'addSending' && (
                    <Columns>
                      <Column>
                        <Panel.Section>
                          <Panel.Headline>Get Started!</Panel.Headline>
                          <Stack>
                            <Text>
                              <TranslatableText>At least one </TranslatableText>
                              <Bold>verified sending domain </Bold>
                              <TranslatableText>
                                is required in order to start or enable analytics.
                              </TranslatableText>
                            </Text>
                            <div>
                              <PageLink variant="primary" to="/domains/list/sending" as={Button}>
                                Add Sending Domain
                              </PageLink>
                            </div>
                          </Stack>
                        </Panel.Section>
                      </Column>
                      <Box as={Column} display={['none', 'none', 'block']} width={[0, 0, 0.5]}>
                        <Box height="100%">
                          <Picture role="presentation">
                            <source srcset={SendingMailWebp} type="image/webp" />
                            <OnboardingPicture alt="" src={SendingMail} seeThrough />
                          </Picture>
                        </Box>
                      </Box>
                    </Columns>
                  )}

                  {onboarding === 'verifySending' && (
                    <Columns>
                      <Column>
                        <Panel.Section>
                          <Panel.Headline>Get Started!</Panel.Headline>
                          <Stack>
                            <Text>
                              <TranslatableText>
                                Once a sending domain has been added, it needs to be
                              </TranslatableText>
                              <Bold> verified. </Bold>
                              <TranslatableText>
                                Follow the instructions on the domain details page to configure your
                              </TranslatableText>
                              <TranslatableText> DNS settings.</TranslatableText>
                            </Text>
                            <div>
                              <PageLink variant="primary" to={verifySendingLink} as={Button}>
                                Verify Sending Domain
                              </PageLink>
                            </div>
                          </Stack>
                        </Panel.Section>
                      </Column>
                      <Box as={Column} display={['none', 'none', 'block']} width={[0, 0, 0.5]}>
                        <Box height="100%">
                          <Picture role="presentation">
                            <source srcset={SendingMailWebp} type="image/webp" />
                            <OnboardingPicture alt="" src={SendingMail} seeThrough />
                          </Picture>
                        </Box>
                      </Box>
                    </Columns>
                  )}

                  {onboarding === 'createApiKey' && (
                    <Columns>
                      <Column>
                        <Panel.Section>
                          <Panel.Headline>Start Sending!</Panel.Headline>
                          <Stack>
                            <Text>
                              <TranslatableText>Create an </TranslatableText>
                              <Abbreviation title="Application Programming Interface">
                                API&nbsp;
                              </Abbreviation>
                              <TranslatableText>
                                key in order to start sending via API or SMTP.
                              </TranslatableText>
                            </Text>
                            <div>
                              <ExternalLink
                                variant="primary"
                                size="default"
                                showIcon={false}
                                to="/account/api-keys/create"
                                as={Button}
                              >
                                Create API Key
                              </ExternalLink>
                            </div>
                          </Stack>
                        </Panel.Section>
                      </Column>
                      <Box as={Column} display={['none', 'none', 'block']} width={[0, 0, 0.5]}>
                        <Box height="100%">
                          <Picture role="presentation">
                            <source srcset={ConfigurationWebp} type="image/webp" />
                            <OnboardingPicture alt="" src={Configuration} seeThrough />
                          </Picture>
                        </Box>
                      </Box>
                    </Columns>
                  )}

                  {onboarding === 'startSending' && (
                    <Columns>
                      <Column>
                        <Panel.Section>
                          <Panel.Headline>Start Sending!</Panel.Headline>
                          <Stack>
                            <Text>
                              Follow the Getting Started documentation to set up sending via API or
                              SMTP.
                            </Text>
                            <div>
                              <ExternalLink
                                variant="primary"
                                size="default"
                                showIcon={false}
                                to={LINKS.ONBOARDING_SENDING_EMAIL}
                                as={Button}
                              >
                                Getting Started Documentation
                              </ExternalLink>
                            </div>
                          </Stack>
                        </Panel.Section>
                      </Column>
                      <Box as={Column} display={['none', 'none', 'block']} width={[0, 0, 0.5]}>
                        <Box height="100%">
                          <Picture role="presentation">
                            <source srcset={ConfigurationWebp} type="image/webp" />
                            <OnboardingPicture alt="" src={Configuration} seeThrough />
                          </Picture>
                        </Box>
                      </Box>
                    </Columns>
                  )}
                </Dashboard.Panel>
              )}
              {onboarding === 'fallback' && (
                <Dashboard.Panel>
                  <Columns>
                    <Column>
                      <Panel.Section>
                        <Panel.Headline>Analytics Report</Panel.Headline>
                        <Stack>
                          <Text>
                            Build custom analytics, track engagement, diagnose errors, and more.
                          </Text>
                          <div>
                            <ExternalLink
                              variant="primary"
                              size="default"
                              showIcon={false}
                              to="/signals/analytics"
                              as={Button}
                            >
                              Go To Analytics Report
                            </ExternalLink>
                          </div>
                        </Stack>
                      </Panel.Section>
                    </Column>
                    <Box as={Column} display={['none', 'none', 'block']} width={[0, 0, 0.5]}>
                      <Box height="100%">
                        <Picture role="presentation">
                          <source srcset={ConfigurationWebp} type="image/webp" />
                          <OnboardingPicture alt="" src={Configuration} seeThrough />
                        </Picture>
                      </Box>
                    </Box>
                  </Columns>
                </Dashboard.Panel>
              )}
              <div data-id="dashboard-helpful-shortcuts">
                <Dashboard.Panel>
                  <Panel.Section>
                    <Panel.Headline>
                      <Panel.HeadlineIcon as={LightbulbOutline} />
                      <TranslatableText>Helpful Shortcuts</TranslatableText>
                    </Panel.Headline>

                    <Columns collapseBelow="md">
                      {isAnAdmin && (
                        <Dashboard.Tip>
                          <PageLink to="/account/users/create">Invite a Team Member</PageLink>
                          <Text>
                            Need help integrating? Want to share an Analytics Report? Invite your
                            team!
                          </Text>
                        </Dashboard.Tip>
                      )}
                      {!isAnAdmin && (
                        <Dashboard.Tip>
                          <PageLink to="/templates">Templates</PageLink>
                          <Text>
                            Programmatically tailor each message with SparkPost’s flexible
                            templates.
                          </Text>
                        </Dashboard.Tip>
                      )}
                      <Dashboard.Tip>
                        <PageLink to="/reports/message-events">Events</PageLink>
                        <Text>
                          Robust searching capabilities with ready access to the raw event data from
                          your emails.
                        </Text>
                      </Dashboard.Tip>
                      <Dashboard.Tip>
                        <ExternalLink to="https://www.sparkpost.com/inbox-tracker/">
                          Inbox Tracker
                        </ExternalLink>
                        <Text>
                          Examine every element of deliverability with precision using Inbox
                          Tracker.
                        </Text>
                      </Dashboard.Tip>
                    </Columns>
                  </Panel.Section>
                </Dashboard.Panel>
              </div>
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
