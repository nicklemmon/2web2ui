import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OpenInNew } from '@sparkpost/matchbox-icons';
import { Button, UnstyledLink } from 'src/components/matchbox';

const StyledIcon = styled('div')`
  margin: ${props => props.iconMargin};
`;

const ExternalLink = ({
  as: Component = UnstyledLink,
  children,
  component: _component, // ignore, won't apply external props correctly if set
  icon: Icon = OpenInNew,
  ...props
}) => {
  const isButton = Component.name === 'Button';
  let iconSize = 13;
  let iconMargin = '-0.1em 0 0 0';

  if (isButton) {
    iconSize = 18;
    iconMargin = '0 0 0 4px';
  }

  return (
    <Component {...props} external={true}>
      {children} <StyledIcon size={iconSize} as={Icon} iconMargin={iconMargin} />
    </Component>
  );
};

ExternalLink.propTypes = {
  as: PropTypes.oneOf([Button, UnstyledLink]),
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default ExternalLink;
