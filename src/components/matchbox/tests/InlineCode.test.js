import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import InlineCode from '../InlineCode';

jest.mock('src/context/HibanaContext');

describe('InlineCode', () => {
  it('throws an error when Hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const subject = () => shallow(<InlineCode />);

    expect(subject).toThrowError();
  });

  it('renders with passed in children when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const wrapper = shallow(<InlineCode>This is some code</InlineCode>);

    expect(wrapper).toHaveTextContent('This is some code');
  });
});
