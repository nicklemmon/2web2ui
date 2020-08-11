import React from 'react';
import { useHibana } from 'src/context/HibanaContext';
import { Layout as HibanaLayout } from '@sparkpost/matchbox-hibana';

const ERROR_MESSAGE =
  'Layout component not available in original matchbox. Please remove or restrict to Hibana';

function Layout(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    throw new Error(ERROR_MESSAGE);
  }

  return <HibanaLayout {...props} />;
}

function Section(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    throw new Error(ERROR_MESSAGE);
  }

  return <HibanaLayout.Section {...props} />;
}

function SectionTitle(props) {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    throw new Error(ERROR_MESSAGE);
  }

  return <HibanaLayout.SectionTitle {...props} />;
}

Section.displayName = 'Layout.Section';
SectionTitle.displayName = 'Layout.SectionTitle';

Layout.Section = Section;
Layout.SectionTitle = SectionTitle;

export default Layout;
