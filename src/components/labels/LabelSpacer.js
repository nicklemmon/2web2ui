import React from 'react';
import styled from 'styled-components';
import { Label } from 'src/components/matchbox';

const LabelWrapper = styled.div`
  visibility: hidden;
`;

export default function LabelSpacer() {
  return (
    <LabelWrapper aria-hidden="true">
      {/* The content rendered inside the label doesn't matter, but is needed to render the element at its full height */}
      <Label label="A" />
    </LabelWrapper>
  );
}
