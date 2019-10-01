import React from 'react';
import { connect } from 'react-redux';
import { showAlert } from 'src/actions/globalAlert';
import {
  getDraft,
  getPreview,
  getPublished,
  update as updateDraft,
  publish as publishDraft,
  deleteTemplate,
  create as createTemplate,
  sendPreview
} from 'src/actions/templates';
import { updateRecipientList, getRecipientList } from 'src/actions/recipientLists';
import { list as listDomains } from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import {
  selectDraftTemplateById,
  selectDraftTemplatePreview,
  selectPreviewLineErrors,
<<<<<<< HEAD
  selectPublishedTemplateById
=======
  selectPublishedTemplate,
  selectTemplateTestData
>>>>>>> TR-1374-lemmon-flavor - Incorporate templates actions
} from 'src/selectors/templates';
import { EditorContextProvider } from './context/EditorContext';
import EditAndPreviewPage from './EditAndPreviewPage';

const EditAndPreviewPageContainer = (props) => (
  <EditorContextProvider value={props}>
    <EditAndPreviewPage />
  </EditorContextProvider>
);

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const draft = selectDraftTemplateById(state, id);
  const published = selectPublishedTemplateById(state, id);
  const isPublishedMode = props.match.params.version === 'published';
  const draftOrPublished = draft || published;
  const hasDraft = draftOrPublished && draftOrPublished.has_draft;
  const hasPublished = draftOrPublished && draftOrPublished.has_published;

  return {
    draft,
    published,
    isPublishedMode,
    hasDraft,
    hasPublished,
    hasDraftFailedToLoad: Boolean(state.templates.getDraftError),
    hasFailedToPreview: Boolean(state.templates.contentPreview.error),
    isDraftLoading: !draft || Boolean(state.templates.getDraftLoading),
    isDeletePending: state.templates.deletePending,
    isDraftUpdating: Boolean(state.templates.updating),
    isDraftPublishing: Boolean(state.templates.publishPending),
    preview: selectDraftTemplatePreview(state, id, {}),
    previewLineErrors: selectPreviewLineErrors(state),
    templateTestData: selectTemplateTestData(state)
  };
};

const mapDispatchToProps = {
  getDraft,
  getPreview,
  getPublished,
  deleteTemplate,
  createTemplate,
  updateDraft,
  publishDraft,
  getRecipientList,
  updateRecipientList,
  listDomains,
  listSubaccounts,
  sendPreview,
  showAlert,
  getTestData,
  setTestData
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAndPreviewPageContainer);
