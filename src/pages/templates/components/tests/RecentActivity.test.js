import React from 'react';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import RecentActivity from '../RecentActivity';

describe('RecentActivity', () => {
  const publishedTemplate = {
    id: 'template-1',
    name: 'Template 1',
    last_update_time: '2019-10-18T17:30:49+00:00',
    list_status: 'published',
  };
  const publishedWithDraftTemplate = {
    id: 'template-2',
    name: 'Template 2',
    last_update_time: '2019-10-18T17:30:49+00:00',
    list_status: 'published_with_draft',
  };
  const draftTemplate = {
    id: 'template-3',
    name: 'Template 3',
    last_update_time: '2019-10-18T17:30:49+00:00',
    list_status: 'draft',
  };

  const subject = props => {
    const defaultProps = {
      hasActionButtons: true,
    };

    return render(
      <TestApp>
        <RecentActivity {...defaultProps} {...props} />
      </TestApp>,
    );
  };

  it('renders an empty fragment when fewer than 2 templates are present', () => {
    const { queryByText } = subject({
      templates: [publishedTemplate, draftTemplate],
    });

    expect(queryByText('Recent Activity')).not.toBeInTheDocument();
  });

  it('renders a list of templates with relevant links when there are more than 2 templates', () => {
    const { queryByText, queryAllByRole } = subject({
      templates: [publishedWithDraftTemplate, publishedTemplate, draftTemplate],
    });

    // expect(wrapper).toHaveTextContent('Recent Activity');
    expect(queryByText('Recent Activity')).toBeInTheDocument();
    expect(queryByText(publishedWithDraftTemplate.name)).toBeInTheDocument();
    expect(queryAllByRole('link')[0]).toHaveAttribute(
      'href',
      `/templates/edit/${publishedWithDraftTemplate.id}/published/content`,
    );
    expect(queryByText(publishedWithDraftTemplate.name)).toBeInTheDocument();
    expect(queryAllByRole('link')[1]).toHaveAttribute(
      'href',
      `/templates/edit/${publishedTemplate.id}/published/content`,
    );
    expect(queryByText(draftTemplate.name)).toBeInTheDocument();
    expect(queryAllByRole('link')[2]).toHaveAttribute(
      'href',
      `/templates/edit/${draftTemplate.id}/draft/content`,
    );
  });

  it('renders a maximum of four templates when more than four are present', () => {
    const { queryAllByRole } = subject({
      templates: [
        publishedWithDraftTemplate,
        publishedTemplate,
        draftTemplate,
        draftTemplate,
        draftTemplate,
      ],
    });

    expect(queryAllByRole('listitem')).toHaveLength(4);
    expect(queryAllByRole('listitem')).not.toHaveLength(5);
  });

  it('does not render action buttons when `hasActionButtons` is `false`', () => {
    const { queryAllByText } = subject({
      templates: [publishedWithDraftTemplate, publishedTemplate, draftTemplate],
      hasActionButtons: false,
    });

    expect(queryAllByText('Delete Template')).toHaveLength(0);
    expect(queryAllByText('Duplicate Template')).toHaveLength(0);
  });
});
