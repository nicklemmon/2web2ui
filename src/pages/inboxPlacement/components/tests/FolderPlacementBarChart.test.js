import React from 'react';
import { shallow } from 'enzyme';

import FolderPlacementBarChart from '../FolderPlacementBarChart';

describe('Component: FolderPlacementBarChart', () => {
  const defaultPlacements = {};
  const subject = props =>
    shallow(<FolderPlacementBarChart placements={defaultPlacements} {...props} />);

  it('renders nothing with defaults', () => {
    expect(subject().isEmptyRender()).toBe(true);
  });

  it('renders correct with data', () => {
    const placements = {
      inbox_pct: 0.905,
      spam_pct: 0.55,
      missing_pct: 0.4,
    };

    expect(subject({ placements })).toMatchSnapshot();
  });
});
