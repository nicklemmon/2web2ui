import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import styles from './TooltipMetric.module.scss';
import { Box, Text } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';

const TooltipMark = styled('div')`
  background: ${props => props.color};
`;

export const OGTooltipMetric = ({ color = '#6e6e73', description, label, value }) => (
  <div className={styles.Wrapper}>
    <div className={styles.TooltipMetric}>
      <TooltipMark color={color} className={styles.Color} />
      <div className={classNames(styles.Content, description && styles.hasDescription)}>
        <div className={styles.Label}>{label}</div>
        {description && <div className={styles.Description}>{description}</div>}
        <div className={styles.Value}>{value}</div>
      </div>
    </div>
  </div>
);

const LabelText = styled('div')`
  transform: 'translateY(-2px)'; /* Fixes slight vertical centering problem */
  font-size: ${props => props.theme.fontSizes['200']};
  font-weight: ${props => props.theme.fontWeights.light};
  line-height: ${props => props.theme.lineHeights['200']};
`;

const ValueText = styled('span')`
  transform: 'translateY(-4px)';
  font-size: ${props => props.theme.fontSizes['200']};
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

export const HibanaTooltipMetric = ({
  color = 'gray.600',
  description = '',
  label = '',
  value = '',
}) => (
  <Box display="flex" alignItems="flex-start" justifyContent="flex-start" width="100%">
    <Box
      backgroundColor={color}
      border="1px solid white" // todo, yuck
      borderRadius="circle"
      display="inline-flex"
      flexShrink="0" // Prevents the circle from getting kinda squishy
      size={16}
      role="presentation"
    />

    <Box
      marginLeft="200"
      display="inline-flex"
      alignItems="flex-start"
      justifyContent="space-between"
      width="100%"
    >
      <div>
        <LabelText>{label}</LabelText>

        {description && (
          <Text as="div" fontSize="100" fontWeight="300" margin-top="200">
            {description}
          </Text>
        )}
      </div>

      <ValueText>{value}</ValueText>
    </Box>
  </Box>
);

const TooltipMetric = props => useHibanaToggle(OGTooltipMetric, HibanaTooltipMetric)(props);

export default TooltipMetric;
