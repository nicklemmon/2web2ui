import React from 'react';
import useUniqueId from 'src/hooks/useUniqueId';
import { tokens } from '@sparkpost/design-tokens-hibana';
import styled from 'styled-components';
import { useHibana } from 'src/context/HibanaContext';

const StyledLabel = styled.div`
  font-size: ${props => (props.isHibanaEnabled ? props.theme.fontSizes[200] : '0.89rem')};
  font-weight: ${props => (props.isHibanaEnabled ? props.theme.fontWeights['semibold'] : 600)};
  color: ${props => props.isHibanaEnabled && props.dark && props.theme.colors.gray[600]};
`;

const StyledValue = styled.div`
  font-size: ${props => (props.isHibanaEnabled ? props.theme.fontSizes[400] : '0.89rem')};
  color: ${props => props.isHibanaEnabled && props.dark && tokens.color_white};
`;

const Definition = ({ children, dark }) => {
  const id = useUniqueId('definition');

  return React.Children.map(children, child => {
    if (child.type === Label) {
      return React.cloneElement(child, { id, dark });
    }

    if (child.type === Value) {
      return React.cloneElement(child, { ariaLabelledby: id, dark });
    }

    return null;
  });
};

const Label = ({ children, id, dark }) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  return (
    <StyledLabel id={id} dark={dark} isHibanaEnabled={isHibanaEnabled}>
      {children}
    </StyledLabel>
  );
};
const Value = ({ ariaLabelledby, children, dark }) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  return (
    <StyledValue aria-labelledby={ariaLabelledby} dark={dark} isHibanaEnabled={isHibanaEnabled}>
      {children}
    </StyledValue>
  );
};

Definition.Label = Label;
Definition.Value = Value;

export default Definition;
