import React from 'react';
import { useHibana } from 'src/context/HibanaContext';
import { Column as HibanaColumn } from '@sparkpost/matchbox-hibana';

export default function Column(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    throw new Error(
      'Column component not available in original matchbox. Please remove or restrict to Hibana',
    );
  }

  return <HibanaColumn {...props} />;
}
