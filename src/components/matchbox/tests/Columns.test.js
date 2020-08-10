import React from 'react';
import { shallow } from 'enzyme';
import Columns from '../Columns';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('Columns', () => {
  const subject = props => shallow(<Columns {...props} />);

  it('should throw an error when Hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    expect(subject).toThrowError();
  });

  it('should render with passed in props when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const wrapper = subject({
      space: '500',
      align: 'right',
      reverse: true,
      collapseBelow: 'sm',
    });

    expect(wrapper.find('Columns')).toExist();
    expect(wrapper).toHaveProp('space', '500');
    expect(wrapper).toHaveProp('align', 'right');
    expect(wrapper).toHaveProp('reverse', true);
    expect(wrapper).toHaveProp('collapseBelow', 'sm');
  });
});
