import { shallow } from 'enzyme';
import React from 'react';

import { SeedListPage } from '../SeedListPage';
import { InstructionsContent } from '../SeedListPage';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('Page: SeedList tests', () => {
  const defaults = {
    loading: false,
    seeds: [],
    getSeedList: jest.fn(),
    referenceSeed: 'ref1@seed.sparkpost.com',
  };
  const subject = props => {
    return shallow(<SeedListPage {...defaults} {...props} />);
  };

  it('renders OG version', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const wrapper = subject();
    expect(wrapper.find('InstructionsContent')).toExist();
    expect(wrapper.find('Page')).toHaveProp('title', 'Create an Inbox Placement Test');
  });

  it('renders Hibana version', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const wrapper = subject();
    expect(wrapper.find('InstructionsContent')).toExist();
    expect(wrapper.find('Page')).toHaveProp('title', 'Inbox Placement Data');
  });

  it('renders instructions', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const wrapper = shallow(<InstructionsContent {...defaults} />);
    expect(wrapper).toHaveTextContent(defaults.referenceSeed);
  });

  it('renders loading', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const wrapper = subject({ pending: true });
    expect(wrapper.find('Loading')).toExist();
  });

  it('renders error message', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const wrapper = subject({ error: true });
    expect(wrapper.find('ApiErrorBanner')).toExist();
  });
});
