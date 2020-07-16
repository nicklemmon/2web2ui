import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Box } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import OGStyles from './PageDescription.module.scss';
import hibanaStyles from './PageDescriptionHibana.module.scss';

export function OGPageDescription(props) {
  const { children, className } = props;

  return (
    <p className={classNames(OGStyles.PageDescription, className)} data-id={props['data-id']}>
      {children}
    </p>
  );
}

export function HibanaPageDescription(props) {
  const { children, className, mb = '500', maxWidth = '1200' } = props;

  return (
    <Box
      as="p"
      color="gray.700"
      fontSize="300"
      lineHeight="300"
      mb={mb}
      maxWidth={maxWidth}
      className={classNames(hibanaStyles.PageDescription, className)}
      data-id={props['data-id']}
    >
      {children}
    </Box>
  );
}

export default function PageDescription(props) {
  return useHibanaToggle(OGPageDescription, HibanaPageDescription)(props);
}

PageDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  mb: PropTypes.string,
  maxWidth: PropTypes.string,
  'data-id': PropTypes.string,
};
