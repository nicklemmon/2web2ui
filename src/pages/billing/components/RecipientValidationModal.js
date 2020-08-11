import React from 'react';
import { Box, Grid, Panel, Stack, Text } from 'src/components/matchbox';
import { OGOnlyWrapper } from 'src/components/hibana';
import { Close } from '@sparkpost/matchbox-icons';
import { formatCurrency, formatFullNumber } from 'src/helpers/units';
import styles from './RecipientValidationModal.module.scss';
import cx from 'classnames';
import { RECIPIENT_VALIDATION_TIERS } from 'src/constants';
import totalRecipientValidationCost from 'src/helpers/recipientValidation';

export default ({ onClose, volumeUsed }) => {
  const TierRows = RECIPIENT_VALIDATION_TIERS.map(({ volumeMax, volumeMin, cost }) => {
    const tierCost = Math.max(Math.min(volumeMax, volumeUsed) - volumeMin, 0) * cost;
    const tierEmpty = tierCost <= 0;

    const rowClass = cx(styles.PriceRow, tierEmpty && styles.EmptyTier);

    return (
      <Grid className={rowClass} key={`rv_tier_${volumeMin}_${volumeMax || 'plus'}`}>
        <Grid.Column xs={5}>
          <span className={styles.Bold}>
            {volumeMax < Infinity
              ? `${formatFullNumber(volumeMin)} - ${formatFullNumber(volumeMax)}`
              : `${formatFullNumber(volumeMin)}+`}{' '}
            emails
          </span>
        </Grid.Column>
        <Grid.Column xs={1}>
          <span>at</span>
        </Grid.Column>
        <Grid.Column xs={3}>
          <span className={styles.Bold}>${cost} per email</span>
        </Grid.Column>
        {!tierEmpty && (
          <Grid.Column xs={1} style={{ textAlign: 'center' }}>
            <span>=</span>
          </Grid.Column>
        )}
        {!tierEmpty && (
          <Grid.Column xs={2} style={{ textAlign: 'right' }}>
            <span className={styles.Bold}>{formatCurrency(tierCost)}</span>
          </Grid.Column>
        )}
      </Grid>
    );
  });

  return (
    <OGOnlyWrapper
      as={Panel}
      actions={[{ content: <Close />, onClick: onClose }]}
      className={styles.modalContainer}
      title="How was this calculated?"
    >
      <Box as={Panel} title="How was this calculated?">
        <Panel.Section>
          <Stack space="200">
            <Stack space="200">{TierRows}</Stack>
            <Box borderTop="1px solid" paddingTop="400" borderColor="gray.400">
              <Grid className={styles.TotalCost}>
                <Grid.Column xs={3} xsOffset={6}>
                  Total:
                </Grid.Column>
                <Grid.Column style={{ textAlign: 'right' }} xs={3}>
                  <Text color="gray.900" fontWeight="600">
                    {totalRecipientValidationCost(volumeUsed)}
                  </Text>
                </Grid.Column>
              </Grid>
            </Box>
          </Stack>
        </Panel.Section>
      </Box>
    </OGOnlyWrapper>
  );
};
