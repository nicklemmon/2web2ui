import React, { forwardRef } from 'react';
import { ListBox as HibanaListBox } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

const ListBox = forwardRef((props, ref) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    throw new Error(
      'ListBox component not available in original matchbox. Please remove or restrict to Hibana',
    );
  }

  return <HibanaListBox ref={ref} {...props} />;
});

const Option = forwardRef((props, ref) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    throw new Error(
      'ListBox component not available in original matchbox. Please remove or restrict to Hibana',
    );
  }

  return <HibanaListBox.Option ref={ref} {...props} />;
});

ListBox.Option = Option;
Option.displayName = 'ListBox.Option';
ListBox.displayName = 'ListBox';

export default ListBox;
