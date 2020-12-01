import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import LabelValue from '../LabelValue';

jest.mock('src/context/HibanaContext');

describe('LabelValue', () => {
  it('throws an error when Hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const subject = () => shallow(<LabelValue />);

    expect(subject).toThrowError();
  });

  it('renders with passed in children when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const subject = () =>
      shallow(
        <LabelValue>
          <LabelValue.Label>Hello</LabelValue.Label>
          <LabelValue.Value>World</LabelValue.Value>
        </LabelValue>,
      );
    const wrapper = subject();

    expect(wrapper).toHaveTextContent('Hello');
    expect(wrapper).toHaveTextContent('World');
  });
});
