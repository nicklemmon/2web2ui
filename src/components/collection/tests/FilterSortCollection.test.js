import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import FilterSortCollection from '../FilterSortCollection';
import { Table } from 'src/components/matchbox';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';

describe('FilterSortCollection Component', () => {
  const fruits = ['apple', 'banana', 'cherry'];
  const vegetables = ['artichoke', 'broccoli', 'celery'];
  const props = {
    title: 'Menu',
    selectOptions: [
      { value: 'fruit', label: 'Fruit' },
      { value: 'vegetable', label: 'Vegetable' },
    ],
    filterBoxConfig: {
      show: true,
      itemToStringKeys: ['fruit', 'vegetable'],
      placeholder: 'Search By: Fruit, Vegetable',
      wrapper: props => <div>{props}</div>,
    },
    defaultSortColumn: 'fruit',
    rows: [
      {
        fruit: fruits[0],
        vegetable: vegetables[2],
      },
      {
        fruit: fruits[1],
        vegetable: vegetables[0],
      },
      {
        fruit: fruits[2],
        vegetable: vegetables[1],
      },
    ],
    rowComponent: ({ fruit, vegetable }, iterator) => [
      <Table.Row
        key={iterator}
        rowData={[
          <div>
            <p>{fruit}</p>
            <p>{vegetable}</p>
          </div>,
        ]}
      />,
    ],
  };

  describe('renders', () => {
    const subject = (props = {}) =>
      render(
        <TestApp>
          <FilterSortCollection {...props} />
        </TestApp>,
      );

    it('renders with header', () => {
      const propsWithHeaderColumns = { ...props, columns: ['fruit', 'vegetables'] };
      const { queryByText } = subject(propsWithHeaderColumns);
      expect(queryByText('fruit')).toBeInTheDocument();
      expect(queryByText('vegetables')).toBeInTheDocument();
    });
  });

  describe('sorts', () => {
    const subject = (props = {}) =>
      mount(
        <TestApp>
          <FilterSortCollection {...props} />
        </TestApp>,
      );

    it('sorts default sort column (fruits) values in default descending order', () => {
      const wrapper = subject({ ...props });
      const rowsWrapper = wrapper.find('rowComponent');

      expect(rowsWrapper).toHaveLength(3);
      expect(rowsWrapper.at(0)).toHaveProp('fruit', fruits[2]);
      expect(rowsWrapper.at(1)).toHaveProp('fruit', fruits[1]);
      expect(rowsWrapper.at(2)).toHaveProp('fruit', fruits[0]);
    });

    it('sorts default sort column values (fruit) in ascending order', () => {
      const wrapper = subject({ ...props, defaultSortDirection: 'asc' });
      const rowsWrapper = wrapper.find('rowComponent');

      expect(rowsWrapper).toHaveLength(3);
      expect(rowsWrapper.at(0)).toHaveProp('fruit', fruits[0]);
      expect(rowsWrapper.at(1)).toHaveProp('fruit', fruits[1]);
      expect(rowsWrapper.at(2)).toHaveProp('fruit', fruits[2]);
    });

    it('sorts selected sort column (vegetables) values in default descending order', () => {
      const wrapper = subject({ ...props });
      act(() => {
        wrapper.find('select option[value="vegetable"]').simulate('change');
      });
      wrapper.update();
      const rowsWrapper = wrapper.find('rowComponent');

      expect(rowsWrapper).toHaveLength(3);
      expect(rowsWrapper.at(0)).toHaveProp('vegetable', vegetables[2]);
      expect(rowsWrapper.at(1)).toHaveProp('vegetable', vegetables[1]);
      expect(rowsWrapper.at(2)).toHaveProp('vegetable', vegetables[0]);
    });

    it('sorts selected sort column (vegetables) values in ascending order', () => {
      const wrapper = subject({ ...props, defaultSortDirection: 'asc' });
      act(() => {
        wrapper.find('select option[value="vegetable"]').simulate('change');
      });
      wrapper.update();
      const rowsWrapper = wrapper.find('rowComponent');

      expect(rowsWrapper).toHaveLength(3);
      expect(rowsWrapper.at(0)).toHaveProp('vegetable', vegetables[0]);
      expect(rowsWrapper.at(1)).toHaveProp('vegetable', vegetables[1]);
      expect(rowsWrapper.at(2)).toHaveProp('vegetable', vegetables[2]);
    });
  });
});
