import React from 'react';
import { useHibana } from 'src/context/HibanaContext';
import { Columns as HibanaColumns } from '@sparkpost/matchbox-hibana';

export default function Columns(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    throw new Error(
      'Columns component not available in original matchbox. Please remove or restrict to Hibana',
    );
  }

  return <HibanaColumns {...props} />;
}
