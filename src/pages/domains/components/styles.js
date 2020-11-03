import styled from 'styled-components';

export const StyledFilterFields = styled.div`
  display: grid;
  grid-gap: ${props => props.theme.space['500']};
  grid-template-columns: 2fr 165px auto;

  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    grid-template-columns: 1fr;
  }
`;

export const StyledGridCell = styled.div`
  justify-self: end;

  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    justify-self: start;
  }
`;

export const StatusPopoverContent = styled.span`
  display: inline-block; /* Necessary to supply width */
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  > * {
    /* Hacky fix, but addresses vertical centering without introducing a flex parent that wreaks havoc on text truncation */
    display: inline-block;
    transform: translateY(2px);
  }
`;
