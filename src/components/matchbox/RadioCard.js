import React, { forwardRef } from 'react';
import { RadioCard as HibanaRadioCard } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

const ERROR_MESSAGE = 'RadioCard and RadioCard.Group can only be used with Hibana enabled.';

const RadioCard = forwardRef((props, ref) => {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaRadioCard ref={ref} {...props} />;
});

function Group(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaRadioCard.Group {...props} />;
}

RadioCard.displayName = 'RadioCard';
Group.displayName = 'RadioCard.Group';

RadioCard.Group = Group;

export default RadioCard;
