import React from 'react';
import { ListBox as HibanaListBox } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

function ListBox(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    throw new Error(
      'ListBox component not available in original matchbox. Please remove or restrict to Hibana',
    );
  }

  return <HibanaListBox {...props} />;
}

function Option(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    throw new Error(
      'ListBox component not available in original matchbox. Please remove or restrict to Hibana',
    );
  }

  return <HibanaListBox.Option {...props} />;
}

ListBox.Option = Option;
Option.displayName = 'ListBox.Option';
ListBox.displayName = 'ListBox';

export default ListBox;
