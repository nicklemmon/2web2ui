import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from '../Tabs';
jest.mock('src/context/HibanaContext', () => ({
  useHibana: jest.fn().mockReturnValue([{ isHibanaEnabled: false }]),
}));

describe('Tabs Component: ', () => {
  const subject = props => {
    const defaults = {
      tabs: [{ content: 'Tab 1' }, { content: 'Tab 2' }],
      forceRender: true,
    };

    return render(
      <Tabs {...defaults} {...props}>
        <Tabs.Item>First Content</Tabs.Item>
        {false && <Tabs.Item>Not Shown Content</Tabs.Item>}
        <Tabs.Item>Second Content</Tabs.Item>
      </Tabs>,
    );
  };

  it('renders Tabs correctly', () => {
    const { queryByText } = subject();
    expect(queryByText('Tab 1')).toBeInTheDocument();
    expect(queryByText('Tab 2')).toBeInTheDocument();
    expect(queryByText('First Content')).toBeVisible();
    expect(queryByText('Second Content')).not.toBeInTheDocument();
  });

  it('loads and switches to second tab when clicked', () => {
    const { queryByText } = subject();
    expect(queryByText('Second Content')).not.toBeInTheDocument();
    userEvent.click(queryByText('Tab 2'));
    expect(queryByText('Not Shown Content')).not.toBeInTheDocument();
    expect(queryByText('First Content')).not.toBeVisible();
    expect(queryByText('Second Content')).toBeVisible();
  });

  it('does not render tabs (but renders content) when there is only 1 tab', () => {
    const { queryByText } = subject({ tabs: [{ content: 'Tab 1' }] });
    expect(queryByText('Tab 1')).not.toBeInTheDocument();
    expect(queryByText('Tab 2')).not.toBeInTheDocument();
    expect(queryByText('First Content')).toBeVisible();
  });
});
