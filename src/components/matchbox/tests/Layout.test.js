import React from 'react';
import { shallow } from 'enzyme';
import Layout from '../Layout';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('Layout', () => {
  const subject = props => shallow(<Layout {...props} />);

  it('throws an error when used outside of Hibana', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    expect(subject).toThrowError();
  });

  it('renders with passed in props when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const wrapper = subject({ foo: 'bar' });

    expect(wrapper).toExist();
    expect(wrapper).toHaveProp('foo', 'bar');
  });

  describe('Layout.Section', () => {
    const subject = props => shallow(<Layout.Section {...props} />);

    it('throws an error when used outside of Hibana', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });

    it('renders with passed in props when Hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const wrapper = subject({ foo: 'bar' });

      expect(wrapper).toExist();
      expect(wrapper).toHaveProp('foo', 'bar');
    });
  });

  describe('Layout.SectionTitle', () => {
    const subject = props => shallow(<Layout.SectionTitle {...props} />);

    it('throws an error when used outside of Hibana', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });

    it('renders with passed in props when Hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const wrapper = subject({ foo: 'bar' });

      expect(wrapper).toExist();
      expect(wrapper).toHaveProp('foo', 'bar');
    });
  });
});
