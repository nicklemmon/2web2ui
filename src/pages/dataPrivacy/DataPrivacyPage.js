import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Page, Panel, Tabs } from 'src/components/matchbox';
import { TabsWrapper } from 'src/components';
import { PageDescription } from 'src/components/text';
import { resetDataPrivacy } from 'src/actions/dataPrivacy';
import ApiDetailsTab from './components/ApiDetailsTab';
import SingleRecipientTab from './components/SingleRecipientTab';
import MultipleRecipientsTab from './components/MultipleRecipientsTab';

const tabs = [
  { content: 'Single Recipient', key: 'single-recipient' },
  { content: 'Multiple Recipients', key: 'multiple-recipients' },
  { content: 'API Integration', key: 'api' },
];
export const DataPrivacyPage = props => {
  const [tabIndex, setTabIndex] = useState(
    tabs.findIndex(x => x.key === props.match.params.category) || 0,
  );
  useEffect(() => {
    props.history.replace(`/account/data-privacy/${tabs[tabIndex].key}`);
  }, [props.history, tabIndex]);

  const handleTabs = tabIdx => {
    props.resetDataPrivacy();
    setTabIndex(tabIdx);
  };

  const renderTabs = tabIdx => {
    switch (tabIdx) {
      case 0:
        return <SingleRecipientTab />;
      case 1:
        return <MultipleRecipientsTab />;
      case 2:
        return <ApiDetailsTab history={props.history} />;

      default:
        return <Panel.LEGACY.Section></Panel.LEGACY.Section>;
    }
  };

  return (
    <Page title="Data and Privacy">
      <PageDescription>
        Fill in this form to request deletion of recipient data or opt-out of third party data usage
        of recipient's personal information. Your request will be completed within 30 days.
      </PageDescription>

      <Panel.LEGACY>
        <TabsWrapper>
          <Tabs
            selected={tabIndex}
            connectBelow={true}
            tabs={tabs.map(({ content }, idx) => ({
              content,
              onClick: () => handleTabs(idx),
            }))}
          />
          {renderTabs(tabIndex)}
        </TabsWrapper>
      </Panel.LEGACY>
    </Page>
  );
};

export default connect(null, { resetDataPrivacy })(withRouter(DataPrivacyPage));
