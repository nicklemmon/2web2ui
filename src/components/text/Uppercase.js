import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledText = styled.span`
  text-transform: uppercase;
`;

export default function Uppercase(props) {
  const { as = 'span', children } = props;

  return (
    <StyledText as={as} data-id={props['data-id']}>
      {children}
    </StyledText>
  );
}

Uppercase.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  'data-id': PropTypes.string,
};
