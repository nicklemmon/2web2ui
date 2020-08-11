import { shallow } from 'enzyme';
import React from 'react';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

import ApiDetails from '../ApiDetails';
import styles from '../ApiDetails.module.scss';

jest.mock('src/hooks/useHibanaOverride');

describe('ApiDetails tab', () => {
  beforeEach(() => {
    useHibanaOverride.mockReturnValue(styles);
  });

  it('should render page correctly', () => {
    const wrapper = shallow(<ApiDetails />);

    expect(wrapper).toHaveTextContent('Integrate Now');
    expect(wrapper.find('CodeBlock')).toExist();
  });
});
