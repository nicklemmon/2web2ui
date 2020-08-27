import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loading } from 'src/components/loading';
import { Panel } from 'src/components/matchbox';

const StyledPanelSection = styled.div`
  min-height: ${props => props.minHeight};
  position: 'relative';
`;

const PanelSectionLoading = ({ minHeight }) => {
  return (
    <StyledPanelSection as={Panel.LEGACY.Section} data-id="panel-section-loading">
      <Loading minHeight={minHeight} />
    </StyledPanelSection>
  );
};

PanelSectionLoading.propTypes = {
  minHeight: PropTypes.string,
};

PanelSectionLoading.defaultProps = {
  minHeight: '400px',
};

export default PanelSectionLoading;
