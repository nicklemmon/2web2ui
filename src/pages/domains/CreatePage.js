import React from 'react';
import { Page } from 'src/components/matchbox';
import Domains from './components';

export default function CreatePage() {
  return (
    <Domains.Container>
      <Page title="Add a Domain"></Page>
    </Domains.Container>
  );
}
