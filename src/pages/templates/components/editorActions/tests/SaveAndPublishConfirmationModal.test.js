import React from 'react';
import { shallow } from 'enzyme';
import useEditorContext from '../../../hooks/useEditorContext';
import { routeNamespace } from '../../../constants/routes';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import SaveAndPublishConfirmationModal from '../SaveAndPublishConfirmationModal';

jest.mock('../../../hooks/useEditorContext');

describe('SaveAndPublishConfirmationModal', () => {
  const subject = (editorState, history, props) => {
    useEditorContext.mockReturnValue({
      draft: {
        id: 'foo'
      },
      isDraftPublishing: false,
      publishDraft: jest.fn(),
      parsedTestData: {
        options: {},
        metadata: {},
        substitution_data: {}
      },
      setHasSaved: jest.fn(),
      ...editorState
    });

    return shallow(
      <SaveAndPublishConfirmationModal
        onCancel={jest.fn()}
        open={true}
        {...props}
      />
    );
  };

  it('renders', () => {
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('sets the `ConfirmationModal` `open` prop to `false` when set via the `open` prop of the wrapper', () => {
    const wrapper = subject(undefined, undefined, { open: false });

    expect(wrapper.find('ConfirmationModal').props().open).toEqual(false);
  });

  it('on confirm, 1) calls publishDraft and 2) redirects to published path upon publishing', async () => {
    const publishDraftPromise = Promise.resolve();
    const parsedTestData = {
      options: {
        foo: 'bar'
      },
      metadata: {
        meta: 'data'
      },
      substitution_data: {
        substitution: 'data'
      }
    };
    const publishDraft = jest.fn(() => publishDraftPromise);
    const draft = { id: 'foo', subaccount_id: 101 };
    const content = { text: 'foo text', html: '<h1>foo html</h1>' };
    const wrapper = subject({
      publishDraft,
      draft,
      content,
      parsedTestData
    });
    wrapper.find('ConfirmationModal').simulate('confirm');

    expect(publishDraft).toHaveBeenCalledWith(
      {
        id: draft.id,
        content,
        parsedTestData
      },
      101
    );

    return publishDraftPromise.then(() => {
      expect(wrapper.find('RedirectAndAlert')).toHaveProp('to', `/${routeNamespace}/edit/${draft.id}/published/content${setSubaccountQuery(draft.subaccount_id)}`);
    });
  });
});
