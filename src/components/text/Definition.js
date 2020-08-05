import React from 'react';
import useUniqueId from 'src/hooks/useUniqueId';
import Bold from './Bold';
import { Box } from 'src/components/matchbox';
import { tokens } from '@sparkpost/design-tokens-hibana';

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
  return (
    <Bold id={id}>
      <Box color={dark && tokens.color_gray_600}>{children}</Box>
    </Bold>
  );
};
const Value = ({ ariaLabelledby, children, dark }) => (
  <div aria-labelledby={ariaLabelledby}>
    <Box color={dark && tokens.color_white}>{children}</Box>
  </div>
);

Definition.Label = Label;
Definition.Value = Value;

export default Definition;
