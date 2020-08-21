import React from 'react';
import { shallow } from 'enzyme';
import Segment from '../Segment';
import getConfig from 'src/helpers/getConfig';

jest.mock('src/helpers/getConfig');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    location: {
      pathname: '/',
    },
  }),
}));

describe('Segment', () => {
  const subject = () => shallow(<Segment />);

  it('does not add the script when segment config is enabled: false', () => {
    getConfig.mockReturnValue(false);
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('adds the script when segment config is enabled: true', () => {
    getConfig.mockReturnValueOnce(true).mockReturnValueOnce('abcdefg1234567');
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });
});
