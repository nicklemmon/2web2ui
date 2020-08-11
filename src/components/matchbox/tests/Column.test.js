import React from 'react';
import { shallow } from 'enzyme';
import Column from '../Column';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('Column', () => {
  const subject = props => shallow(<Column {...props} />);

  it('should throw an error when Hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    expect(subject).toThrowError();
  });

  it('should render with passed in props when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const wrapper = subject({
      space: '500',
    });

    expect(wrapper.find('Column')).toExist();
    expect(wrapper).toHaveProp('space', '500');
  });
});
