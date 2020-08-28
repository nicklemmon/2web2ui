import React from 'react';
import styled from 'styled-components';
import { Grid, Panel, Toggle } from 'src/components/matchbox';
import LabelledValue from 'src/components/labelledValue/LabelledValue';

const RightAlignedText = styled.div`
  text-align: right;
`;

export const TogglePanelSection = ({ readOnly, tfaRequired, toggleTfaRequired }) => {
  const tfaRequiredMsg = tfaRequired
    ? 'All users must have two-factor authentication enabled to login to this account.'
    : 'Each user can manage their own two-factor authentication settings.';

  return (
    <Panel.LEGACY.Section>
      <Grid>
        <Grid.Column xs={12} md={10}>
          <LabelledValue label="Status">
            <strong>{tfaRequired ? 'Required' : 'Optional'}</strong>
            <p>{tfaRequiredMsg}</p>
          </LabelledValue>
        </Grid.Column>
        <Grid.Column xs={12} md={2}>
          <RightAlignedText>
            <Toggle
              id="enforceTfa"
              disabled={readOnly}
              checked={tfaRequired}
              onChange={toggleTfaRequired}
            />
          </RightAlignedText>
        </Grid.Column>
      </Grid>
    </Panel.LEGACY.Section>
  );
};

export default TogglePanelSection;
