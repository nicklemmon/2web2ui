import React from 'react';
import { Panel as OGPanel } from '@sparkpost/matchbox';
import { Panel as HibanaPanel } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

HibanaPanel.displayName = 'HibanaPanel';
HibanaPanel.Section.displayName = 'HibanaPanelSection';
HibanaPanel.Footer.displayName = 'HibanaPanelFooter';
OGPanel.displayName = 'OGPanel';
OGPanel.Section.displayName = 'OGPanelSection';
OGPanel.Footer.displayName = 'OGPanelFooter';

const Panel = props => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGPanel {...omitSystemProps(props)} />;
  }

  // TODO: Remove baked in margin
  return <HibanaPanel mb={props.mb ? props.mb : '500'} {...props} />;
};

const Section = props => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  if (!isHibanaEnabled) {
    return <OGPanel.Section {...omitSystemProps(props)} />;
  }
  return <HibanaPanel.Section {...props} />;
};

const Footer = props => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  if (!isHibanaEnabled) {
    return <OGPanel.Footer {...omitSystemProps(props, ['left', 'right'])} />;
  }
  return <HibanaPanel.Footer {...props} />;
};

Section.displayName = 'Panel.Section';
Footer.displayName = 'Panel.Footer';

Panel.Section = Section;
Panel.Footer = Footer;

export default Panel;
