import { shallow } from 'enzyme';
import React from 'react';
import SignalsPage from '../SignalsPage';
import * as helpers from 'src/helpers/signals';
jest.mock('src/helpers/signals');

describe('Signals Page Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      title: 'test title',
      pass: 'through',
      facet: 'facet',
      facetId: 'facetId',
      subaccountId: 22,
    };
    helpers.getFriendlyTitle = jest.fn();
    wrapper = shallow(<SignalsPage {...props} />);
  });

  it('renders correctly with title', () => {
    expect(wrapper).toMatchSnapshot();
    expect(helpers.getFriendlyTitle).toHaveBeenCalledWith({
      facet: 'facet',
      facetId: 'facetId',
      subaccountId: 22,
    });
  });
});
