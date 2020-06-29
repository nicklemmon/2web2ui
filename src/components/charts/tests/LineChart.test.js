import React from 'react';
import { render, screen } from '@testing-library/react';
import { useHibana } from 'src/context/HibanaContext';
import LineChart from '../LineChart';
jest.mock('src/context/HibanaContext');
useHibana.mockImplementation(() => [{ isHibanaEnabled: true }]);

describe('LineChart', () => {
  describe('CustomTooltip', () => {
    const defaultProps = {
      showTooltip: true,
      payload: [],
      label: 'Example Label',
      labelFormatter: str => str,
      formatter: str => str,
    };
    const subject = props => render(<LineChart.CustomTooltip {...defaultProps} {...props} />);

    it('renders nothing if the `showTooltip` prop is falsy', () => {
      subject({ showTooltip: false });

      expect(screen.queryByText('Example Label')).not.toBeInTheDocument();
    });

    it('renders if the `showTooltip` prop is truthy', () => {
      subject({ showTooltip: true });

      expect(screen.queryByText('Example Label')).toBeInTheDocument();
    });

    it('renders the passed in `label` prop using the passed in `labelFormatter` function', () => {
      const uppercaseStr = str => str.toUpperCase();
      subject({ label: 'I should be uppercased', labelFormatter: uppercaseStr });

      expect(screen.getByText('I SHOULD BE UPPERCASED')).toBeInTheDocument();
    });

    it('renders with the passed in payload content using the passed in `formatter` function', () => {
      const payload = [
        {
          stroke: '#000',
          name: 'Name 1',
          value: 'VALUE ONE',
        },
        {
          stroke: '#FFF',
          name: 'NAME 2',
          value: 'VaLuE TwO',
        },
      ];
      const formatter = str => str.toLowerCase();
      subject({ payload, formatter });

      expect(screen.getByText('Name 1')).toBeInTheDocument();
      expect(screen.getByText('value one')).toBeInTheDocument();
      expect(screen.getByText('NAME 2')).toBeInTheDocument();
      expect(screen.getByText('value two')).toBeInTheDocument();
    });
  });
});
