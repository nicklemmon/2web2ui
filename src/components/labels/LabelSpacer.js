import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from 'src/components/matchbox';

const LabelWrapper = styled.div`
  visibility: hidden;
`;

function LabelSpacer({ className }) {
  return (
    <LabelWrapper aria-hidden="true" className={className}>
      {/* The content rendered inside the label doesn't matter, but is needed to render the element at its full height */}
      <Label label="A" />
    </LabelWrapper>
  );
}

LabelSpacer.propTypes = {
  className: PropTypes.string,
};

export default LabelSpacer;
