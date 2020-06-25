import React from 'react';
import { shallow } from 'enzyme';
import DatePicker from '../DatePicker';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('Drawer', () => {
  const subject = () => shallow(<DatePicker />);

  it('should throw error with drawer using the component', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    expect(subject).toThrowError();
  });
  it('should render in hibana', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    expect(subject().find('DatePicker')).toExist();
  });
});
