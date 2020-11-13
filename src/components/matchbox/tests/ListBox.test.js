import React from 'react';
import ListBox from '../ListBox';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('ListBox', () => {
  it('renders the Hibana <ListBox/> when Hibana enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const wrapper = shallow(<ListBox />);

    expect(wrapper).toHaveDisplayName('ListBox');
  });

  it('renders the Hibana <ListBox.Option/> when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const wrapper = shallow(<ListBox.Option />);

    expect(wrapper).toHaveDisplayName('ListBox.Option');
  });

  it('renders with passed in props when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const wrapper = shallow(<ListBox>Children!</ListBox>);

    expect(wrapper).toHaveProp('children', 'Children!');
  });

  it('should throw error with ListBox using the component', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const wrapper = () => shallow(<ListBox>Children!</ListBox>);
    expect(wrapper).toThrowError();
  });
});
