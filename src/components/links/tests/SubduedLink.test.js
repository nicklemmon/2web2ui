import React from 'react';
import { shallow } from 'enzyme';
import SubduedLink from '../SubduedLink';
import { useHibana } from 'src/context/HibanaContext';
jest.mock('src/context/HibanaContext');

describe('SubduedLink', () => {
  const subject = props => shallow(<SubduedLink to="/dashboard" {...props} />);

  it('renders a styled link when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const wrapper = subject();
    expect(wrapper).toHaveDisplayName('Styled(UnstyledLink)');
  });

  it('renders a unstyled link when Hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    const wrapper = subject();
    expect(wrapper).toHaveDisplayName('UnstyledLink');
  });
});
