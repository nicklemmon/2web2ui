import React, { forwardRef } from 'react';
import { Checkbox as OGCheckbox } from '@sparkpost/matchbox';
import { Checkbox as HibanaCheckbox } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

const Checkbox = forwardRef((props, ref) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGCheckbox ref={ref} {...omitSystemProps(props)} />;
  }

  return <HibanaCheckbox ref={ref} {...props} />;
});

const Group = props => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGCheckbox.Group {...omitSystemProps(props)} />;
  }

  return <HibanaCheckbox.Group {...props} />;
};

Checkbox.displayName = 'Checkbox';
Group.displayName = 'Checkbox.Group';
Checkbox.Group = Group;

HibanaCheckbox.displayName = 'HibanaCheckbox';
HibanaCheckbox.Group.displayName = 'HibanaCheckbox.Group';

export default Checkbox;
