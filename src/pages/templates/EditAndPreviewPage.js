import React from 'react';
import { Prompt } from 'react-router';
import { RedirectAndAlert } from 'src/components/globalAlert';
import FullPage from 'src/components/fullPage';
import Loading from 'src/components/loading';
import { Tag } from 'src/components/matchbox';
import { OGOnlyWrapper } from 'src/components/hibana';
import EditNavigation from './components/EditNavigation';
import links from './constants/editNavigationLinks';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import useEditorContext from './hooks/useEditorContext';
import OGStyles from './EditAndPreviewPage.module.scss';
import hibanaStyles from './EditAndPreviewPageHibana.module.scss';
import { routeNamespace } from './constants/routes';

const EditAndPreviewPage = () => {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const {
    currentNavigationIndex,
    draft,
    hasDraftFailedToLoad,
    isDraftLoading,
    isPublishedMode,
    hasSaved,
  } = useEditorContext();
  const Contents = links[currentNavigationIndex].render;
  const PrimaryArea = links[currentNavigationIndex].renderPrimaryArea;

  if (hasDraftFailedToLoad) {
    return (
      <RedirectAndAlert
        to={`/${routeNamespace}`}
        alert={{ type: 'error', message: 'Unable to load template' }}
      />
    );
  }

  if (isDraftLoading) {
    return <Loading />;
  }

  const primaryArea = () => (
    <div data-id="template-status">
      {isPublishedMode ? (
        <Tag color="green">
          <OGOnlyWrapper as="span" className={styles.StatusContent}>
            Published
          </OGOnlyWrapper>
        </Tag>
      ) : (
        <Tag>
          <OGOnlyWrapper as="span" className={styles.StatusContent}>
            Draft
          </OGOnlyWrapper>
        </Tag>
      )}
    </div>
  );

  const title = draft => {
    if (!isPublishedMode) {
      return `${draft.name} (DRAFT)`;
    }

    return draft.name;
  };

  return (
    <FullPage
      breadcrumbRedirectsTo={`/${routeNamespace}`}
      title={title(draft)}
      primaryArea={primaryArea()}
    >
      <div className={styles.EditorNav}>
        <EditNavigation primaryArea={<PrimaryArea />} />
      </div>

      <div className={styles.MainContent}>
        <Contents />
      </div>

      <Prompt
        when={!hasSaved}
        message={location => {
          if (location.pathname.startsWith(`/${routeNamespace}/edit`)) {
            return true;
          }

          return 'Are you sure you want to leave the page? If you return to the previous page, your work will not be saved.';
        }}
      />
    </FullPage>
  );
};

export default EditAndPreviewPage;
