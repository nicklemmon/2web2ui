import React from 'react';
import { connect } from 'react-redux';
import { Page, Panel } from 'src/components/matchbox';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import CancellationPanel from './components/CancellationPanel';
import SingleSignOnPanel from './components/SingleSignOnPanel';
import EnforceTfaPanel from './components/EnforceTfaPanel';
import UIOptionsPanel from './components/UIOptionsPanel';

export function AccountSettingsPage({ currentUser }) {
  return (
    <Page title="Account Settings">
      <Panel.LEGACY sectioned>
        <LabelledValue label="Account ID">{currentUser.customer}</LabelledValue>
      </Panel.LEGACY>
      <SingleSignOnPanel />
      <EnforceTfaPanel />
      <UIOptionsPanel />
      <CancellationPanel />
    </Page>
  );
}

const mapStateToProps = ({ currentUser }) => ({ currentUser });

export default connect(mapStateToProps)(AccountSettingsPage);
