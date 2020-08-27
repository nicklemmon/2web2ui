import React from 'react';
import { Column, Page, Panel, Stack, Text } from 'src/components/matchbox';
import { Heading } from 'src/components/text';

function Dashboard({ children }) {
  return <Page>{children}</Page>;
}

Dashboard.Heading = ({ children }) => {
  return (
    <Heading as="h2">
      <Text fontWeight="normal" as="span">
        {children}
      </Text>
    </Heading>
  );
};

Dashboard.Panel = ({ children }) => {
  return <Panel.LEGACY marginBottom="0">{children}</Panel.LEGACY>;
};

Dashboard.Shortcut = ({ children }) => {
  return (
    <Column>
      <Stack space="200">{children}</Stack>
    </Column>
  );
};

export default Dashboard;
