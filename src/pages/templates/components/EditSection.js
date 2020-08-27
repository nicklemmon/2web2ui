import React, { useState } from 'react';
import {
  ActionList,
  Button,
  Panel,
  Popover,
  ScreenReaderOnly,
  Tabs,
  Tag,
} from 'src/components/matchbox';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import ConfirmationModal from 'src/components/modals/ConfirmationModal';
import { useHibana } from 'src/context/HibanaContext';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import tabs from '../constants/editTabs';
import InsertSnippetModal from './InsertSnippetModal';
import useEditorContext from '../hooks/useEditorContext';
import OGStyles from './EditSection.module.scss';
import hibanaStyles from './EditSectionHibana.module.scss';

const EditSection = () => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  const {
    currentTabIndex,
    currentTabKey,
    setTab,
    setContent,
    content,
    isPublishedMode,
    canModify,
    isReadOnly,
  } = useEditorContext();
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [isSnippetModalOpen, setSnippetModalOpen] = useState(false);
  const [isAMPModalOpen, setAMPModalOpen] = useState(false);

  const currentTab = tabs[currentTabIndex];
  const TabComponent = currentTab.render;
  const hasReadOnlyTag = isReadOnly && currentTab.key !== 'test_data';
  const hasPopover = !isPublishedMode && canModify;
  const AMPBoilerplate = `
<!DOCTYPE html>
<html ⚡4email>
  <head>
    <meta charset="utf-8" />
    <style amp4email-boilerplate>
      body {
        visibility: hidden;
      }
    </style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
  </head>
  <body>
    Hello, world.
  </body>
</html>
  `.trim(); // Tabbing is weird here to ensure no extra tabs are rendered in the editor
  const popoverActions = [
    {
      content: 'Insert Snippet',
      onClick: () => handleInsertSnippetClick(),
      role: 'button',
      title: 'Opens a dialog',
      'data-id': 'popover-action-insert-snippet',
    },
    currentTabKey === 'amp_html' && {
      content: 'Insert AMP Boilerplate',
      onClick: () => handleInsertAMPClick(),
      role: 'button',
      title: 'Opens a dialog',
      'data-id': 'popover-action-insert-amp-boilerplate',
    },
  ].filter(Boolean); // Removes empty items from the array

  const handleInsertSnippetClick = () => {
    setPopoverOpen(false);
    setSnippetModalOpen(true);
  };

  const handleInsertAMPClick = () => {
    setPopoverOpen(false);
    setAMPModalOpen(true);
  };

  const handleAMPConfirmClick = () => {
    setAMPModalOpen(false);
    setContent({
      ...content,
      amp_html: AMPBoilerplate,
    });
  };

  let tabsFitted = false;

  if (isHibanaEnabled) {
    tabsFitted = true;
  }

  return (
    <Panel.LEGACY className={styles.EditSection} mb="0">
      <div className={styles.TabsWrapper}>
        <Tabs
          disableResponsiveBehavior={true}
          fitted={tabsFitted}
          color="blue"
          selected={currentTabIndex}
          onSelect={nextTabIndex => {
            setTab(nextTabIndex);
          }}
          tabs={tabs.map(({ _render, ...tab }) => tab)}
        />

        {hasReadOnlyTag && (
          <div className={styles.TagWrapper}>
            <Tag color="yellow">
              <span>Read Only</span>
            </Tag>
          </div>
        )}

        {hasPopover && (
          <Popover
            id="popover-action-list"
            left
            open={isPopoverOpen}
            onClose={() => setPopoverOpen(false)}
            trigger={
              <Button
                flat
                className={styles.MoreButton}
                aria-controls="popover-action-list"
                onClick={() => setPopoverOpen(!isPopoverOpen)}
                data-id="popover-trigger-more"
              >
                <MoreHoriz size={25} />

                <ScreenReaderOnly>More</ScreenReaderOnly>
              </Button>
            }
          >
            <ActionList actions={popoverActions} />
          </Popover>
        )}
      </div>

      <TabComponent />

      <InsertSnippetModal
        open={isSnippetModalOpen}
        onClose={() => setSnippetModalOpen(false)}
        loading={false}
      />

      <ConfirmationModal
        open={isAMPModalOpen}
        title="Are you sure you want to insert the AMP Email Boilerplate?"
        content={<p>Any existing markup in the AMP tab will be lost.</p>}
        confirmVerb="Insert"
        onCancel={() => setAMPModalOpen(false)}
        onConfirm={handleAMPConfirmClick}
      />
    </Panel.LEGACY>
  );
};

export default EditSection;
