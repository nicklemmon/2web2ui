import React from 'react';
import { Layout, Box, ProgressBar, Stack } from 'src/components/matchbox';
import { SubduedText, Heading } from 'src/components/text';

export default function FeatureUsageSection({ billingSubscription }) {
  const { products } = billingSubscription;

  const getProduct = product_name => products.find(x => x.product === product_name);
  const getPercent = (used, limit) => Math.floor((used / limit) * 100);

  const hasAnyProductOnSubscription = getProduct('dedicated_ip') && getProduct('subaccounts');
  if (!hasAnyProductOnSubscription) return null;
  return (
    <>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Feature Usage</Layout.SectionTitle>
        <SubduedText>Feature Limits are specific to account's plan.</SubduedText>
      </Layout.Section>
      <Layout.Section>
        <Box border="400" borderColor="gray.400" padding="400">
          <Stack>
            {getProduct('dedicated_ip') && (
              <Stack space="100">
                <Heading looksLike="h6" as="h3">
                  Dedicated IPs
                </Heading>
                <SubduedText>
                  {getProduct('dedicated_ip').quantity || 0} of {getProduct('dedicated_ip').limit}
                </SubduedText>
                <ProgressBar
                  completed={getPercent(
                    getProduct('dedicated_ip').quantity || 0,
                    getProduct('dedicated_ip').limit,
                  )}
                ></ProgressBar>
              </Stack>
            )}
            {getProduct('subaccounts') && (
              <Stack space="100">
                <Heading looksLike="h6" as="h3">
                  Subaccounts
                </Heading>
                <SubduedText>
                  {getProduct('subaccounts').quantity || 0} of {getProduct('subaccounts').limit}
                </SubduedText>
                <ProgressBar
                  completed={getPercent(
                    getProduct('subaccounts').quantity || 0,
                    getProduct('subaccounts').limit,
                  )}
                ></ProgressBar>
              </Stack>
            )}
          </Stack>
        </Box>
      </Layout.Section>
    </>
  );
}
