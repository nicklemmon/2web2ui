import React, { forwardRef } from 'react';
import { Radio as OGRadio } from '@sparkpost/matchbox';
import { Radio as HibanaRadio } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

const Radio = forwardRef((props, ref) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGRadio ref={ref} {...omitSystemProps(props)} />;
  }

  return <HibanaRadio ref={ref} {...props} />;
});

function Group(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGRadio.Group {...omitSystemProps(props)} />;
  }

  return <HibanaRadio.Group {...props} />;
}

Radio.displayName = 'Radio';
Radio.Group = Group;
Radio.Group.displayName = 'Radio.Group';
OGRadio.displayName = 'OGRadio';
OGRadio.Group.displayName = 'OGRadio.Group';
HibanaRadio.displayName = 'HibanaRadio';
HibanaRadio.Group.displayName = 'HibanaRadio.Group';

export default Radio;
