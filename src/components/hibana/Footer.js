import React from 'react';
import styled from 'styled-components';
import { Box, Inline, ScreenReaderOnly } from 'src/components/matchbox';
import { ExternalLink } from 'src/components/links';
import { Heading } from 'src/components/text';
import useUniqueId from 'src/hooks/useUniqueId';
import { LINKS } from 'src/constants';

const StyledFooter = styled('footer')`
  padding: ${props => props.theme.space['500']} ${props => props.theme.space['400']};

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    padding: ${props => props.theme.space['600']} ${props => props.theme.space['500']};
  }
`;

const StyledLink = styled(ExternalLink)`
  color: ${props => props.theme.colors.gray['700']};
  font-size: ${props => props.theme.fontSizes['300']};

  &:visited {
    color: ${props => props.theme.colors.gray['700']};
  }
`;

export default function Footer() {
  const headingId = useUniqueId('helpful-links-heading');

  return (
    <StyledFooter aria-labelledby={headingId}>
      <ScreenReaderOnly>
        <Heading as="h2" id={headingId}>
          Helpful Links
        </Heading>
      </ScreenReaderOnly>

      <Box maxWidth="1400" margin="0 auto">
        <Inline space="600">
          <StyledLink to={LINKS.STATUS}>System Status</StyledLink>

          <StyledLink to={LINKS.DOCS}>Documentation</StyledLink>

          <StyledLink to={LINKS.SECURITY}>Security</StyledLink>
        </Inline>
      </Box>
    </StyledFooter>
  );
}
