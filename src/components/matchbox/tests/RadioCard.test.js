import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import RadioCard from '../RadioCard';

jest.mock('src/context/HibanaContext');

describe('RadioCard', () => {
  const subject = () => shallow(<RadioCard id="my-id" />);

  it('renders when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const wrapper = subject();

    expect(wrapper).toBeTruthy();
  });

  it('throws an error when Hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    expect(subject).toThrowError();
  });

  describe('RadioCard.Group', () => {
    const subject = () => shallow(<RadioCard.Group label="My Label" />);

    it('renders when Hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const wrapper = subject();

      expect(wrapper).toBeTruthy();
    });

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });
  });
});
