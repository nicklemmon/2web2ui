import React from 'react';
import { UnstyledLink } from 'src/components/matchbox';
import styled from 'styled-components';
import { useHibana } from 'src/context/HibanaContext';

const StyledLink = styled(UnstyledLink)`
  color: ${props => props.theme.colors.gray['700']};

  &:visited {
    color: ${props => props.theme.colors.gray['700']};
  }
`;

export default function SubduedLink(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  if (isHibanaEnabled) {
    return <StyledLink {...props} />;
  }
  return <UnstyledLink {...props} />;
}
