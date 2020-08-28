import React from 'react';
import { ActionList as OGActionList } from '@sparkpost/matchbox';
import { ActionList as HibanaActionList } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

function ActionList(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGActionList {...omitSystemProps(props, ['maxHeight'])} />;
  }

  return <HibanaActionList {...props} />;
}

function Section(props) {
  return <HibanaActionList.Section {...props} />;
}

function Action(props) {
  return <HibanaActionList.Action {...props} />;
}

Section.displayName = 'ActionList.Section';
Action.displayName = 'ActionList.Action';
ActionList.Section = Section;
ActionList.Action = Action;

export default ActionList;
