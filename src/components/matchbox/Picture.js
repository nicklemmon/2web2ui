import React from 'react';
import { Picture as HibanaPicture } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

const ERROR_MESSAGE = 'The Picture component can only be used with Hibana enabled.';

function Picture(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaPicture {...props} />;
}

function Image(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaPicture.Image {...props} />;
}

Image.displayName = 'Picture.Image';
Picture.Image = Image;

export default Picture;
