import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';

export function OGHeading(props) {
  const { as, looksLike, className, children, id } = props;
  const Component = looksLike ? looksLike : as;
  const headingLevel = as.replace('h', '');

  return (
    <Component
      role="heading"
      aria-level={headingLevel}
      className={className}
      data-id={props['data-id']}
      id={id}
    >
      {children}
    </Component>
  );
}

export function HibanaHeading(props) {
  const { as, looksLike, className, children, id } = props;
  const Component = looksLike ? looksLike : as;
  const headingLevel = as.replace('h', '');

  return (
    <Text
      as={Component}
      role="heading"
      aria-level={headingLevel}
      className={className}
      data-id={props['data-id']}
      id={id}
    >
      {children}
    </Text>
  );
}

export default function Heading(props) {
  return useHibanaToggle(OGHeading, HibanaHeading)(props);
}

Heading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  looksLike: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  className: PropTypes.string,
  'data-id': PropTypes.string,
  id: PropTypes.string,
};
