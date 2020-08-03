import React from 'react';
import { Box, Grid, Inline, Layout } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { PageLink } from 'src/components/links';
import { formatDate } from 'src/helpers/date';
import totalRecipientValidationCost from 'src/helpers/recipientValidation';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { LabelAndKeyPair } from './LabelAndKeyPair';
import _ from 'lodash';

export const RVUsageSection = ({ rvUsage: { recipient_validation } = {} }) => {
  const volumeUsed = _.get(recipient_validation, 'month.used', 0);
  return (
    <>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Recipient Validation Usage</Layout.SectionTitle>
        <SubduedText>
          Validate email addresses by going to{' '}
          <PageLink to="/recipient-validation/list">Recipient Validation</PageLink>
        </SubduedText>
      </Layout.Section>
      <Layout.Section>
        <Box padding="400" backgroundColor={tokens.color_gray_1000}>
          <Grid>
            <Grid.Column sm={3}>
              {recipient_validation && (
                <Box id="date">
                  <LabelAndKeyPair
                    label="Date Range"
                    value={`${formatDate(recipient_validation.month.start)} - ${formatDate(
                      recipient_validation.month.end,
                    )}`}
                  ></LabelAndKeyPair>
                </Box>
              )}
            </Grid.Column>
            <Grid.Column sm={9}>
              <Inline space="400">
                {recipient_validation && (
                  <Box>
                    <LabelAndKeyPair
                      label="Current Cycle Validations"
                      value={volumeUsed.toLocaleString()}
                    ></LabelAndKeyPair>
                  </Box>
                )}
                {recipient_validation && (
                  <Box>
                    <LabelAndKeyPair
                      label="Current Cycle Expenses"
                      value={totalRecipientValidationCost(volumeUsed)}
                    ></LabelAndKeyPair>
                  </Box>
                )}
              </Inline>
            </Grid.Column>
          </Grid>
        </Box>
      </Layout.Section>
    </>
  );
};
