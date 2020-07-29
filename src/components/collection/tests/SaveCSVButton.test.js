import React from 'react';
import SaveCSVButton from '../SaveCSVButton';
import _ from 'lodash';
import { useHibana } from 'src/context/HibanaContext';
import { shallow } from 'enzyme';
import Papa from 'papaparse';

jest.mock('papaparse');
jest.mock('src/context/HibanaContext');

Date.now = jest.fn(() => 1512509841582);

describe('Save CSV Button', () => {
  const props = {
    data: _.times(5, i => ({ key: i + 1 })),
    saveCsv: true,
  };

  const subject = props => shallow(<SaveCSVButton {...props} />);

  beforeEach(() => {
    Papa.unparse = jest.fn(() => 'mydata');
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
  });

  it('should render', () => {
    const wrapper = subject({ ...props, ...{ data: _.times(12, i => ({ key: i + 1 })) } });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not show save as CSV button when false', () => {
    const wrapper = subject({ ...props, ...{ saveCsv: false } });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with given button label', () => {
    const wrapper = subject({ ...props, ...{ caption: 'Click Me!' } });
    expect(wrapper).toHaveTextContent('Click Me!');
  });

  it('should render with given download filename', () => {
    const wrapper = subject({ ...props, ...{ filename: 'NotAVirus.exe' } });
    expect(wrapper).toHaveProp('download', 'NotAVirus.exe');
  });
});
