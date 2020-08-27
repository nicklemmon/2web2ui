import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import useEditorContext from '../../../hooks/useEditorContext';
import TestApp from 'src/__testHelpers__/TestApp';
import DraftModeActions from '../DraftModeActions';
import styles from '../Actions.module.scss';

jest.mock('../../../hooks/useEditorContext');
jest.mock('src/hooks/useHibanaOverride');

describe('DraftModeActions', () => {
  const subject = editorState => {
    useHibanaOverride.mockReturnValue(() => styles);
    useEditorContext.mockReturnValue({
      hasPublished: true,
      draft: {
        id: 'a-random-id-123',
        subaccount_id: 'some-subaccount-id',
      },
      ...editorState,
    });

    return render(
      <TestApp>
        <DraftModeActions />
      </TestApp>,
    );
  };

  it('opens the popover when clicking "Open Menu"', () => {
    const { queryAllByText, queryByText } = subject();

    expect(queryAllByText('Save and Publish')).toHaveLength(1);
    expect(queryByText('Save Draft')).not.toBeInTheDocument();
    expect(queryByText('View Published')).not.toBeInTheDocument();
    expect(queryByText('Duplicate')).not.toBeInTheDocument();
    expect(queryByText('Delete')).not.toBeInTheDocument();

    userEvent.click(queryByText('Open Menu'));

    expect(queryAllByText('Save and Publish')).toHaveLength(2);
    expect(queryByText('Save Draft')).toBeInTheDocument();
    expect(queryByText('View Published')).toBeInTheDocument();
    expect(queryByText('Duplicate')).toBeInTheDocument();
    expect(queryByText('Delete')).toBeInTheDocument();
  });

  it('does not render the "View Published" button when editor context `hasPublished` is false', () => {
    const { queryByText } = subject({ hasPublished: false });

    userEvent.click(queryByText('Open Menu'));

    expect(queryByText('View Published')).not.toBeInTheDocument();
  });

  it('renders the duplicate template modal when clicking "Duplicate"', () => {
    const { queryByText, queryByLabelText } = subject({
      hasPublished: false,
    });

    userEvent.click(queryByText('Open Menu'));
    userEvent.click(queryByText('Duplicate'));

    expect(queryByLabelText(/Template Name/g)).toBeInTheDocument();
    expect(queryByLabelText(/Template ID/g)).toBeInTheDocument();
  });

  it('renders the save and publish confirmation modal when clicking "Save and Publish"', () => {
    const { queryByText, queryAllByText } = subject();

    userEvent.click(queryByText('Open Menu'));
    userEvent.click(queryAllByText('Save and Publish')[1]);

    expect(queryByText('Are you sure you want to publish your template?')).toBeInTheDocument();
  });

  it('renders the delete confirmation modal when clicking "Delete"', () => {
    const { queryByText } = subject();

    userEvent.click(queryByText('Open Menu'));
    userEvent.click(queryByText('Delete'));

    expect(queryByText('Are you sure you want to delete your template?')).toBeInTheDocument();
  });
});
