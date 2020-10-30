import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Label, Text, Toggle } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import styles from './ToggleBlock.module.scss';

function OGToggleBlock({ input, label, helpText, ...rest }) {
  const helpMarkup = helpText ? <p className={styles.Help}>{helpText}</p> : null;

  return (
    <div className={styles.ToggleBlock} data-id="toggle-block">
      <Grid>
        <Grid.Column xs={8}>
          <label className={styles.Label}>{label}</label>
        </Grid.Column>
        <Grid.Column xs={4}>
          <div className={styles.ToggleWrapper}>
            <Toggle id={input.name} {...input} {...rest} />
          </div>
        </Grid.Column>
      </Grid>
      {helpMarkup}
    </div>
  );
}

function HibanaToggleBlock(props) {
  /* variant prop helps adjusting the spacing between toggle and label text*/
  const { input, label, helpText, variant, ...rest } = props;
  const columns = variant === 'dense' ? 4 : 8;
  const justifyContent = variant === 'dense' ? 'flex-start' : 'flex-end';

  return (
    <Box data-id="toggle-block">
      <Grid middle="xs">
        <Grid.Column xs={columns}>
          {/* actual label for ScreenReaders made available via the `Toggle` component */}
          <div aria-hidden="true">
            <Label label={label} fontSize="200" />
          </div>
        </Grid.Column>

        <Grid.Column xs={4}>
          <Box display="flex" alignItems="center" justifyContent={justifyContent}>
            <Toggle
              id={input.name}
              label={label}
              aria-describedby={helpText && `help-text-${input.name}`}
              {...input}
              {...rest}
            />
          </Box>
        </Grid.Column>
      </Grid>

      {helpText && (
        <Box maxWidth="70%">
          <Text color="gray.700" fontSize="200" id={`help-text-${input.name}`}>
            {helpText}
          </Text>
        </Box>
      )}
    </Box>
  );
}

function ToggleBlock(props) {
  return useHibanaToggle(OGToggleBlock, HibanaToggleBlock)(props);
}

ToggleBlock.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  helpText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

export default ToggleBlock;
