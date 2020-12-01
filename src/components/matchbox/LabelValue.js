import React from 'react';
import { LabelValue as HibanaLabelValue } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

const ERROR_MESSAGE = 'LabelValue components can only be used with Hibana enabled.';

function LabelValue(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaLabelValue {...props} />;
}

function Label(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaLabelValue.Label {...props} />;
}

function Value(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaLabelValue.Value {...props} />;
}

Label.displayName = 'LabelValue.Label';
Value.displayName = 'LabelValue.Value';
LabelValue.Label = Label;
LabelValue.Value = Value;

export default LabelValue;
