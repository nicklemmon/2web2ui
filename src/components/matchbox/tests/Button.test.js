import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import Button from '../Button';

jest.mock('src/context/HibanaContext');

describe('Button', () => {
  it('should only render matchbox component when hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    const wrapper = shallow(
      <Button color="orange" size="small">
        Click Me!
      </Button>,
    );

    expect(wrapper).toHaveProp({ color: 'orange', size: 'small' });
  });

  it('should only render hibana component when hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const wrapper = shallow(<Button mb="100">Click Me!</Button>);

    expect(wrapper).toHaveProp({ mb: '100' });
  });

  describe('Button.Group', () => {
    const subject = props =>
      shallow(
        <Button.Group {...props}>
          <Button>Click Me!</Button>
          <Button>Click Me, too!</Button>
        </Button.Group>,
      );

    it('should only render matchbox component when hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
      const wrapper = subject({ mb: '100' });

      expect(wrapper).not.toHaveProp('mb', '100');
    });

    it('should only render hibana component when hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const wrapper = subject({ mb: '100' });

      expect(wrapper).toHaveProp('mb', '100');
    });
  });

  describe('Button.Icon', () => {
    const subject = () => shallow(<Button.Icon />);

    it('renders when Hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const wrapper = subject();

      expect(wrapper).toExist();
    });

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });
  });
});
