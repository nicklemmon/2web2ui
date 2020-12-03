import React from 'react';
import { Panel, Box } from '@sparkpost/matchbox-hibana';
import { getFriendlyFilterLabel } from './Filters';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { NorthEast, SouthEast } from '@sparkpost/matchbox-icons';

function getColor(n) {
  if (n < 0) {
    return tokens.color_red_700;
  }
  return tokens.color_green_700;
}

function getIcon(n) {
  if (n > 0) {
    return NorthEast;
  }
  return SouthEast;
}

function BigNumbers(props) {
  const { data, filters } = props;

  const label = getFriendlyFilterLabel(filters);
  const key = `${filters.dimension}_${filters.precision}_day`;

  // Active user metrics
  const value = data[data.length - 1][key];
  const valueStart = data[0][key];
  const delivered = data[data.length - 1][`delivery_${filters.precision}_day`];
  const deliveredStart = data[0][`delivery_${filters.precision}_day`];

  const rate = (value / delivered) * 100;
  const valueDelta = ((valueStart - value) / value) * 100;

  const rateStart = (valueStart / deliveredStart) * 100;
  const rateDelta = ((rateStart - rate) / rate) * 100;
  const deliveredDelta = ((deliveredStart - delivered) / delivered) * 100;

  const ValueIcon = getIcon(valueDelta);
  const RateIcon = getIcon(rateDelta);
  const DeliveredIcon = getIcon(deliveredDelta);

  return (
    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gridGap="400">
      <Panel gridColumn="1/2">
        <Panel.Section>
          <Box mb="500" color="gray.700">
            {label}
          </Box>
          <Box mb="500" fontSize="700" fontWeight="medium">
            {value?.toLocaleString()}
          </Box>
          <Box fontSize="500" color={getColor(valueDelta)}>
            <ValueIcon size="14px" style={{ marginTop: '-3px' }} /> {valueDelta.toFixed(1)} %
          </Box>
        </Panel.Section>
      </Panel>

      <Panel gridColumn="2/3">
        <Panel.Section>
          <Box mb="500" color="gray.700">
            {label} %
          </Box>
          <Box mb="500" fontSize="700" fontWeight="medium">
            {rate.toFixed(1)}%
          </Box>
          <Box fontSize="500" color={getColor(rateDelta)}>
            <RateIcon size="14px" style={{ marginTop: '-3px' }} /> {rateDelta.toFixed(1)} %
          </Box>
        </Panel.Section>
      </Panel>

      <Panel gridColumn="2/3">
        <Panel.Section>
          <Box mb="500" color="gray.700">
            Delivered
          </Box>
          <Box mb="500" fontSize="700" fontWeight="medium">
            {delivered.toLocaleString()}
          </Box>
          <Box fontSize="500" color={tokens.color_gray_700}>
            <DeliveredIcon size="14px" style={{ marginTop: '-3px' }} /> {deliveredDelta.toFixed(1)}{' '}
            %
          </Box>
        </Panel.Section>
      </Panel>
    </Box>
  );
}

export default BigNumbers;
