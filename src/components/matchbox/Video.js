import React from 'react';
import { Video as HibanaVideo } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';

const ERROR_MESSAGE = 'The Video component can only be used with Hibana enabled.';

function Video(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaVideo {...props} />;
}

function Source(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaVideo.Source {...props} />;
}

Source.displayName = 'Video.Source';
Video.Source = Source;

export default Video;
