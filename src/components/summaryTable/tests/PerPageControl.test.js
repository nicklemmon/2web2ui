import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import PerPageControl from '../PerPageControl';

jest.mock('src/context/HibanaContext');

describe('PerPageControl', () => {
  // TODO: Remove use of `.dive()` when OG theme is removed
  const subject = (props = {}) => shallow(<PerPageControl {...props} />).dive();

  beforeEach(() => useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]));

  it('renders group of buttons', () => {
    const wrapper = subject({
      perPage: 10,
      totalCount: 100,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders null when total count is less than smallest page size', () => {
    const wrapper = subject({ totalCount: 0 });
    expect(wrapper.html()).toBeNull();
  });

  it('calls onChange callback when button is clicked', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange, totalCount: 100 });

    wrapper
      .find('Button')
      .first()
      .simulate('click');

    expect(onChange).toHaveBeenCalledWith(10);
  });
});
