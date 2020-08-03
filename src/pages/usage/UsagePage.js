import React, { useEffect } from 'react';
import { Page, Layout, Box, ProgressBar, Stack } from 'src/components/matchbox';
import { connect } from 'react-redux';
import { fetch as getAccount } from 'src/actions/account';
import { list as getSendingIps } from 'src/actions/sendingIps';
import { MessagingUsageSection } from './components/MessagingUsageSection';
import { SubduedText, Heading } from 'src/components/text';

export function UsagePage({ getAccount, getSendingIps, usage, subscription }) {
  useEffect(() => {
    getAccount({ include: 'usage' });
  }, [getAccount]);

  useEffect(() => {
    getSendingIps();
  }, [getSendingIps]);

  return (
    <Page title="Usage">
      <Layout>
        <MessagingUsageSection usage={usage} subscription={subscription} />
      </Layout>
      <Layout>
        <Layout.Section annotated>
          <Layout.SectionTitle as="h2">Feature Usage</Layout.SectionTitle>
          <SubduedText>Feature Limits are specific to account's plan.</SubduedText>
        </Layout.Section>
        <Layout.Section>
          <Box border="400" borderColor="gray.400" padding="400">
            <Stack>
              <>
                <Heading looksLike="h4" as="p">
                  Dedicated IPs
                </Heading>
                <SubduedText>1 of 4</SubduedText>
                <ProgressBar completed={25}></ProgressBar>
              </>
              <>
                <Heading looksLike="h4" as="p">
                  Subaccounts
                </Heading>
                <SubduedText as="p">10 of 15</SubduedText>
                <ProgressBar completed={25}></ProgressBar>
              </>
            </Stack>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

const mapStateToProps = state => {
  return {
    usage: state.account.usage,
    subscription: state.account.subscription,
  };
};

export default connect(mapStateToProps, { getAccount, getSendingIps })(UsagePage);
