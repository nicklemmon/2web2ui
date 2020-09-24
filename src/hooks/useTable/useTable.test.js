import React, { useEffect, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import config from 'src/config';
import { formatDate } from 'src/helpers/date';
import useTable from './useTable';
import time from 'src/__testHelpers__/time';

const DATA = [
  {
    firstName: 'Sparky',
    lastName: 'Sparkleson Jr.',
    age: 3,
    dob: time(),
  },
  {
    firstName: 'Sparky',
    lastName: 'Sparkleson',
    age: 100,
    dob: time({ day: 2 }),
  },
  {
    firstName: 'Nick',
    lastName: 'Lemmon',
    age: 33,
    dob: time({ day: 3 }),
  },
  {
    firstName: 'Sparky',
    lastName: 'Williams',
    age: 50,
    dob: time({ day: 4 }),
  },
];

describe('useTable', () => {
  describe('filtering', () => {
    it('filters based on user entry by "firstName"', () => {
      render(<TableDemo />);
      const filterField = screen.getByLabelText('Filter By First Name');
      userEvent.type(filterField, 'Nick');

      expect(screen.getByText('Nick')).toBeInTheDocument();
      expect(screen.getByText('Lemmon')).toBeInTheDocument();
      expect(screen.getByText('33')).toBeInTheDocument();
      expect(screen.getByText('Jan 2, 1970')).toBeInTheDocument();
    });

    it('applies no filters when the filter field is empty', () => {
      render(<TableDemo />);
      const filterField = screen.getByLabelText('Filter By First Name');
      userEvent.type(filterField, 'Nick');
      expect(screen.queryAllByText('Sparky')).toHaveLength(0);
      userEvent.clear(filterField);
      expect(screen.getAllByText('Sparky')).toHaveLength(3);
    });

    it('filters by multiple filters simultaneously', () => {
      render(<TableDemo />);
      const firstNameField = screen.getByLabelText('Filter By First Name');
      const lastNameField = screen.getByLabelText('Filter By Last Name');
      userEvent.type(firstNameField, 'Sparky');
      userEvent.type(lastNameField, 'Sparkleson');
      expect(screen.getAllByText('Sparky')).toHaveLength(2);
      expect(screen.getByText('Sparkleson')).toBeInTheDocument();
      expect(screen.getByText('Sparkleson Jr.')).toBeInTheDocument();
    });

    it('ignores case when filtering', () => {
      render(<TableDemo />);
      const firstNameField = screen.getByLabelText('Filter By First Name');
      userEvent.type(firstNameField, 'NICK');
      expect(screen.getByText('Nick')).toBeInTheDocument();
    });

    it('filters based on partial matches', () => {
      render(<TableDemo />);
      const firstNameField = screen.getByLabelText('Filter By First Name');
      userEvent.type(firstNameField, 'Nic');
      expect(screen.getByText('Nick')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('sorts alphabetically by the passed in "sortBy" value', () => {
      let tableRows;
      render(<TableDemo />);
      const sortButton = screen.getByRole('button', { name: 'First Name' });
      userEvent.click(sortButton);
      userEvent.click(sortButton); // Need to click it again to cycle away from default sorting state
      const { getAllByRole } = within(screen.getByTestId('table-body'));
      tableRows = getAllByRole('row');

      expect(within(tableRows[0]).getByText('Nick')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[3]).getByText('Sparky')).toBeInTheDocument();

      userEvent.click(sortButton);
      tableRows = getAllByRole('row');

      expect(within(tableRows[0]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[3]).getByText('Nick')).toBeInTheDocument();
    });

    it('sorts numerically by the passed in "sortBy" value', () => {
      let tableRows;
      render(<TableDemo />);
      const sortButton = screen.getByRole('button', { name: 'Age' });
      userEvent.click(sortButton);
      const { getAllByRole } = within(screen.getByTestId('table-body'));
      tableRows = getAllByRole('row');

      expect(within(tableRows[0]).getByText('3')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('33')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('50')).toBeInTheDocument();
      expect(within(tableRows[3]).getByText('100')).toBeInTheDocument();

      userEvent.click(sortButton);
      tableRows = getAllByRole('row');

      expect(within(tableRows[0]).getByText('100')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('50')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('33')).toBeInTheDocument();
      expect(within(tableRows[3]).getByText('3')).toBeInTheDocument();
    });

    it('sorts chronologically by the passed in "sortBy" value', () => {
      let tableRows;
      render(<TableDemo />);
      const sortButton = screen.getByRole('button', { name: 'Birthday' });
      userEvent.click(sortButton);
      const { getAllByRole } = within(screen.getByTestId('table-body'));
      tableRows = getAllByRole('row');

      expect(within(tableRows[0]).getByText('Dec 31, 1969')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('Jan 1, 1970')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('Jan 2, 1970')).toBeInTheDocument();
      expect(within(tableRows[3]).getByText('Jan 3, 1970')).toBeInTheDocument();

      userEvent.click(sortButton);
      tableRows = getAllByRole('row');

      expect(within(tableRows[0]).getByText('Jan 3, 1970')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('Jan 2, 1970')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('Jan 1, 1970')).toBeInTheDocument();
      expect(within(tableRows[3]).getByText('Dec 31, 1969')).toBeInTheDocument();
    });

    it('renders with default sorting', () => {
      render(<TableDemo />);

      const { getAllByRole } = within(screen.getByTestId('table-body'));
      const tableRows = getAllByRole('row');

      expect(within(tableRows[0]).getByText('Nick')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[3]).getByText('Sparky')).toBeInTheDocument();
    });

    it('allows sorting and filtering to be applied in tandem', () => {
      render(<TableDemo />);
      const filterField = screen.getByLabelText('Filter By First Name');
      const sortButton = screen.getByRole('button', { name: 'Age' });

      userEvent.click(sortButton);
      userEvent.type(filterField, 'Sparky');

      const { getAllByRole, queryByText } = within(screen.getByTestId('table-body'));
      const tableRows = getAllByRole('row');

      expect(queryByText('Nick')).not.toBeInTheDocument();
      expect(tableRows).toHaveLength(3);
      expect(within(tableRows[0]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[0]).getByText('3')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[1]).getByText('50')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('Sparky')).toBeInTheDocument();
      expect(within(tableRows[2]).getByText('100')).toBeInTheDocument();
    });
  });
});

function TableDemo() {
  const [filterByFirstName, setFilterByFirstName] = useState('');
  const [filterByLastName, setFilterByLastName] = useState('');
  const [state, dispatch] = useTable(DATA);

  useEffect(() => {
    dispatch({
      type: 'SORT',
      sortBy: 'firstName',
      direction: 'asc',
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      filters: [
        { name: 'firstName', value: filterByFirstName },
        { name: 'lastName', value: filterByLastName },
      ],
    });
  }, [filterByFirstName, filterByLastName, dispatch]);

  return (
    <div>
      <label htmlFor="filter-by-first-name">Filter By First Name</label>
      <input
        type="text"
        id="filter-by-first-name"
        onChange={e => setFilterByFirstName(e.target.value)}
        value={filterByFirstName}
      />

      <label htmlFor="filter-by-last-name">Filter By Last Name</label>
      <input
        type="text"
        id="filter-by-last-name"
        onChange={e => setFilterByLastName(e.target.value)}
        value={filterByLastName}
      />

      <table>
        <caption>My Table</caption>

        <thead>
          <tr>
            <th>
              <button onClick={() => dispatch({ type: 'SORT', sortBy: 'firstName' })}>
                First Name
              </button>
            </th>
            <th>Last Name</th>
            <th>
              <button onClick={() => dispatch({ type: 'SORT', sortBy: 'age' })}>Age</button>
            </th>
            <th>
              <button onClick={() => dispatch({ type: 'SORT', sortBy: 'dob' })}>Birthday</button>
            </th>
          </tr>
        </thead>

        <tbody data-id="table-body">
          {state.rows.map((row, index) => (
            <tr key={`row-${index}`}>
              <td>{row.firstName}</td>
              <td>{row.lastName}</td>
              <td>{row.age}</td>
              <td>{formatDate(row.dob, config.dateFormatWithComma)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
