import React from 'react';
import { Code, ChatBubble, LightbulbOutline } from '@sparkpost/matchbox-icons';
import { Layout, Page, Panel, ScreenReaderOnly, Stack, Text } from 'src/components/matchbox';
import { Heading, TranslatableText } from 'src/components/text';
import useDashboardContext from './hooks/useDashboardContext';
import styles from './DashboardPageV2.module.scss';

export default function DashboardPageV2() {
  const { currentUser } = useDashboardContext();

  return (
    <Page>
      <ScreenReaderOnly>
        <Heading as="h1">Dashboard</Heading>
      </ScreenReaderOnly>

      <Stack>
        {currentUser?.first_name && (
          <DashboardHeading>
            <TranslatableText>Welcome, </TranslatableText>
            {currentUser.first_name}!
          </DashboardHeading>
        )}

        <Layout>
          <Layout.Section>
            <div className={styles.PanelRow}>
              <Panel>
                <Panel.Section>
                  <Panel.Headline>
                    <Panel.HeadlineIcon as={Code} />

                    <TranslatableText>Setup Documentation</TranslatableText>
                  </Panel.Headline>
                </Panel.Section>
              </Panel>

              <Panel>
                <Panel.Section>
                  <Panel.Headline>
                    <Panel.HeadlineIcon as={ChatBubble} />

                    <TranslatableText>Need Help?</TranslatableText>
                  </Panel.Headline>
                </Panel.Section>
              </Panel>
            </div>

            <Panel>
              <Panel.Section>
                <Panel.Headline>
                  <Panel.HeadlineIcon as={LightbulbOutline} />

                  <TranslatableText>Helpful Shortcuts</TranslatableText>
                </Panel.Headline>
              </Panel.Section>
            </Panel>
          </Layout.Section>

          <Layout.Section annotated>
            <Stack>
              <Layout.SectionTitle as="h3">Account Details</Layout.SectionTitle>

              <Layout.SectionTitle as="h3">Billing/Usage Detail</Layout.SectionTitle>
            </Stack>
          </Layout.Section>
        </Layout>
      </Stack>
    </Page>
  );
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
