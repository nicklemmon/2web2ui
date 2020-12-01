import React from 'react';
import { InlineCode as HibanaInlineCode } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

const ERROR_MESSAGE = 'InlineCode components can only be used with Hibana enabled.';

export default function InlineCode(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaInlineCode {...props} />;
}
