import React from 'react';
import PropTypes from 'prop-types';
import { Panel as OGPanel } from '@sparkpost/matchbox';
import { Panel as HibanaPanel } from '@sparkpost/matchbox-hibana';
import { Heading } from 'src/components/text';
import { Box } from 'src/components/matchbox';
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

const Headline = ({ children, as = 'h3', paddingBottom = '400' }) => {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    throw new Error('Panel.Headline can only be used with Hibana enabled.');
  }

  return (
    <Box paddingBottom={paddingBottom}>
      <Heading as={as}>
        <Box as="span" fontWeight="medium" display="flex" alignItems="center">
          {children}
        </Box>
      </Heading>
    </Box>
  );
};

const HeadlineIcon = ({ as }) => {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    throw new Error('Panel.HeadlineIcon can only be used with Hibana enabled.');
  }

  return <Box as={as} mr="200" marginTop="3px" size={24} />;
};

Section.displayName = 'Panel.Section';
Footer.displayName = 'Panel.Footer';
Headline.displayName = 'Panel.Headline';
HeadlineIcon.displayName = 'Panel.HeadlineIcon';

Headline.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  paddingBottom: PropTypes.string,
};

HeadlineIcon.propTypes = {
  as: PropTypes.func,
};

Panel.Headline = Headline;
Panel.HeadlineIcon = HeadlineIcon;
Panel.Section = Section;
Panel.Footer = Footer;

export default Panel;
