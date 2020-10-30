import React from 'react';
import { shallow } from 'enzyme';
import LabelValue from '../LabelValue';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('LabelValue Matchbox component wrapper', () => {
  const subject = () => {
    return shallow(<LabelValue label="LabelValueid" />);
  };
  it('should throw error with LabelValue using the component', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    expect(subject).toThrowError();
  });
  it('should render in hibana', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    expect(subject().find('LabelValue')).toExist();
  });
});
