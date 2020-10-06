import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'src/components/matchbox';

export default function Emphasized(props) {
  const { children, as = 'span' } = props;

  return (
    <Text as={as} fontStyle="italic" data-id={props['data-id']}>
      {children}
    </Text>
  );
}

Emphasized.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  'data-id': PropTypes.string,
};
