import React from 'react';
import { EmptyState as OGEmptyState } from '@sparkpost/matchbox';
import { EmptyState as HibanaEmptyState } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

const ERROR_MESSAGE =
  'EmptyState components can only be used with Hibana enabled. To use an EmptyState component in both themes, please use EmptyState.LEGACY';

function LEGACY(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGEmptyState {...omitSystemProps(props)} />;
  }

  return <HibanaEmptyState.LEGACY {...props} />;
}
function Header(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaEmptyState.Header {...props} />;
}

function Content(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaEmptyState.Content {...props} />;
}

function List(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaEmptyState.List {...props} />;
}

function Image(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaEmptyState.Image {...props} />;
}

function Action(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaEmptyState.Action {...props} />;
}

function EmptyState(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaEmptyState {...props} />;
}

LEGACY.displayName = 'EmptyState.LEGACY';
Header.displayName = 'EmptyState.Header';
Content.displayName = 'EmptyState.Content';
List.displayName = 'EmptyState.List';
Image.displayName = 'EmptyState.Image';
Action.displayName = 'EmptyState.Action';
EmptyState.Header = Header;
EmptyState.Content = Content;
EmptyState.List = List;
EmptyState.Image = Image;
EmptyState.Action = Action;
EmptyState.LEGACY = LEGACY;

export default EmptyState;
