import React from 'react';
import { RadioCard as HibanaRadioCard } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

const ERROR_MESSAGE = 'RadioCard and RadioCard.Group can only be used with Hibana enabled.';

function RadioCard(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaRadioCard {...props} />;
}

function Group(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaRadioCard.Group {...props} />;
}

Group.displayName = 'RadioCard.Group';

RadioCard.Group = Group;

export default RadioCard;
