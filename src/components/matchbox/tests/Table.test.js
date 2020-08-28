import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import Table from '../Table';

jest.mock('src/context/HibanaContext');

describe('Table Matchbox component wrapper', () => {
  const subject = () => {
    return shallow(<Table>table content is here</Table>);
  };

  it('renders the Hibana version of the Table component correctly when hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const wrapper = subject();

    expect(wrapper).toHaveDisplayName('HibanaTable');
  });

  it('renders default(OG) version of the Table component correctly when hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    const wrapper = subject();

    expect(wrapper).toHaveDisplayName('OGTable');
  });

  describe('Table.Cell', () => {
    const subject = () => {
      return shallow(<Table.Cell>table content is here</Table.Cell>);
    };
    it('renders the Hibana version of the Table.Cell component correctly when hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

      const wrapper = subject();

      expect(wrapper).toHaveDisplayName('HibanaTableCell');
    });

    it('renders default(OG) version of the Table.Cell component correctly when hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      const wrapper = subject();

      expect(wrapper).toHaveDisplayName('OGTableCell');
    });
  });
  describe('Table.HeaderCell', () => {
    const subject = () => {
      return shallow(<Table.HeaderCell>table content is here</Table.HeaderCell>);
    };
    it('renders the Hibana version of the Table.HeaderCell component correctly when hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

      const wrapper = subject();

      expect(wrapper).toHaveDisplayName('HibanaTableHeaderCell');
    });

    it('renders default(OG) version of the Table.HeaderCell component correctly when hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      const wrapper = subject();

      expect(wrapper).toHaveDisplayName('OGTableHeaderCell');
    });
  });

  describe('Table.Row', () => {
    const subject = () => {
      return shallow(<Table.Row>table content is here</Table.Row>);
    };
    it('renders the Hibana version of the Table.Row component correctly when hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

      const wrapper = subject();

      expect(wrapper).toHaveDisplayName('HibanaTableRow');
    });

    it('renders default(OG) version of the Table.Row component correctly when hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      const wrapper = subject();

      expect(wrapper).toHaveDisplayName('OGTableRow');
    });
  });

  describe('Table.TotalsRow', () => {
    const subject = () => shallow(<Table.TotalsRow />);

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
