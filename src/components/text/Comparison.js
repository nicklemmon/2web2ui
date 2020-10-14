import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'src/components/matchbox';
import { Uppercase, Emphasized } from 'src/components/text';

export default function Comparison(props) {
  const { as = 'span', children } = props;

  return (
    <Text as={as} fontWeight="500" data-id={props['data-id']}>
      <Uppercase>
        <Emphasized>{children}</Emphasized>
      </Uppercase>
    </Text>
  );
}

Comparison.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  'data-id': PropTypes.string,
};
