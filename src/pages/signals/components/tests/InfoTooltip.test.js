import { shallow } from 'enzyme';
import React from 'react';
import InfoTooltip from '../InfoTooltip';

jest.mock('src/hooks/useHibanaOverride', () => styles => styles);

describe('Signals InfoTooltip Component', () => {
  const subject = props => shallow(<InfoTooltip content="Foo" {...props} />);

  it('renders with size correctly', () => {
    const wrapper = subject({ size: 15 });

    expect(wrapper.find('InfoOutline').prop('size')).toEqual(15);
  });
});
