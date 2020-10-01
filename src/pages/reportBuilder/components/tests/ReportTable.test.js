import React from 'react';
import { render, within } from '@testing-library/react';
import { ReportTable } from '../ReportTable';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../context/ReportBuilderContext', () => ({
  useReportBuilderContext: jest.fn(() => [{ foo: 'bar' }]),
}));

jest.mock('../AddFilterLink', () => jest.fn(({ newFilter }) => <>{newFilter.value}</>));

//Hibana will be enabled in actual component but this should only affect layout
jest.mock('src/context/HibanaContext', () => ({
  useHibana: jest.fn().mockReturnValue([{ isHibanaEnabled: false }]),
}));

describe('Summary Table', () => {
  let wrapper;

  const props = {
    _getTableData: jest.fn(),
    getSubaccountsList: jest.fn(),
    refresh: jest.fn(),
    metrics: [
      { key: 'metric_1', label: 'Metric 1' },
      { key: 'metric_2', unit: 'millisecond', label: 'Metric 2' },
    ],
    groupBy: 'domain',
    subaccounts: [{ id: 555, name: 'sub 1 name' }],
    tableData: [],
    tableLoading: false,
    hasSubaccounts: false,
  };

  const data = [
    { subaccount_id: 0, metric_1: 123, metric_2: 12345 },
    { subaccount_id: 555, metric_1: 123, metric_2: 12345 },
    { subaccount_id: 1010, metric_1: 123, metric_2: 12345 },
  ];

  const subject = (givenProps = {}) =>
    render(
      <MemoryRouter>
        <ReportTable {...props} {...givenProps} />
      </MemoryRouter>,
    );

  beforeEach(() => {
    wrapper = shallow(<ReportTable {...props} />);
  });

  it('should render empty state with no data', () => {
    expect(wrapper.find('Empty')).toHaveLength(1);
  });

  it('should render loading', () => {
    wrapper.setProps({ tableLoading: true });
    expect(wrapper.find('PanelLoading')).toHaveLength(1);
  });

  it('should render placeholder', () => {
    wrapper.setProps({ groupBy: 'aggregate' }); //TODO RB CLEANUP: change to 'placeholder'
    expect(wrapper.find('PanelLoading')).toHaveLength(0);
    expect(wrapper.find('Empty')).toHaveLength(0);
    expect(wrapper.find('TableCollection')).toHaveLength(0);
  });

  it('should render group by row data', () => {
    const { queryByTestId } = subject({ groupBy: 'subaccount', tableData: data });
    const tableContent = queryByTestId('summary-table');
    expect(within(tableContent).queryByText('Subaccount')).toBeInTheDocument();
    expect(within(tableContent).queryByText('Metric 1')).toBeInTheDocument();
    expect(within(tableContent).queryByText('Master Account (ID 0)')).toBeInTheDocument();
    expect(within(tableContent).queryByText('sub 1 name (ID 555)')).toBeInTheDocument();
    expect(within(tableContent).queryByText('Subaccount 1010')).toBeInTheDocument();
    expect(within(tableContent).queryAllByText('123')).not.toHaveLength(0);
    expect(within(tableContent).queryAllByText('12,345')).not.toHaveLength(0);
  });
});
