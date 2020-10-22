import React from 'react';
import { shallow } from 'enzyme';
import useEditorContext from '../hooks/useEditorContext';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import EditAndPreviewPage from '../EditAndPreviewPage';
import { routeNamespace } from '../constants/routes';
import styles from '../EditAndPreviewPage.module.scss';

jest.mock('../hooks/useEditorContext');
jest.mock('src/hooks/useHibanaOverride');

describe('EditAndPreviewPage', () => {
  beforeEach(() => useHibanaOverride.mockReturnValue(() => styles));
  const subject = ({ editorState } = {}) => {
    useEditorContext.mockReturnValue({
      currentNavigationIndex: 0,
      draft: { id: 'test-template', name: 'Test Template' },
      hasDraftFailedToLoad: false,
      isDraftLoading: false,
      ...editorState,
    });

    return shallow(<EditAndPreviewPage />);
  };

  it('renders a page', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders a page in published mode', () => {
    expect(
      subject({ editorState: { isPublishedMode: true } }).prop('primaryArea'),
    ).toMatchSnapshot();
  });

  it('renders the title with the content "(DRAFT)" appended when not in published mode', () => {
    const wrapper = subject({ editorState: { isPublishedMode: false } });

    expect(wrapper).toHaveProp('title', 'Test Template (DRAFT)');
  });

  it('does not render with the content "(DRAFT)" appended when in published mode', () => {
    const wrapper = subject({ editorState: { isPublishedMode: true } });

    expect(wrapper).toHaveProp('title', 'Test Template');
  });

  it('renders loading', () => {
    const wrapper = subject({ editorState: { isDraftLoading: true } });
    expect(wrapper.find('Loading')).toExist();
  });

  it('redirects and alerts when fails to load', () => {
    const wrapper = subject({ editorState: { hasDraftFailedToLoad: true } });
    expect(wrapper.find('RedirectAndAlert')).toExist();
  });

  it('renders the <Prompt/> message when the editor state has not been saved and the target `pathname` does not match the current starting pattern', () => {
    const wrapper = subject({ editorState: { hasSaved: false } });

    expect(
      wrapper
        .find('Prompt')
        .props()
        .message({ pathname: '/templates' }),
    ).toBe(
      'Are you sure you want to leave the page? If you return to the previous page, your work will not be saved.',
    );
  });

  it('renders does not render the <Prompt/> message when the editor state has not been saved and the target `pathname` does not match the current starting pattern', () => {
    const wrapper = subject({ editorState: { hasSaved: true } });

    expect(
      wrapper
        .find('Prompt')
        .props()
        .message({ pathname: `/${routeNamespace}/edit` }),
    ).toBe(true);
  });
});
