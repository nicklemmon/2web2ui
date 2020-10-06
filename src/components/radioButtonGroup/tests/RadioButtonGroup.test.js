import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioButtonGroup from '../RadioButtonGroup';
import TestApp from 'src/__testHelpers__/TestApp';

describe('RadioButtonGroup', () => {
  describe('The parent `RadioButtonGroup` component', () => {
    it('renders with the passed in children and with the passed in label', () => {
      const { container } = render(
        <TestApp isHibanaEnabled={true}>
          <RadioButtonGroup label="My Radio Group">Hello!</RadioButtonGroup>,
        </TestApp>,
      );
      const fieldsetEl = container.querySelector('fieldset');
      const legendEl = container.querySelector('legend');

      expect(fieldsetEl).toBeTruthy();
      expect(legendEl).toBeTruthy();
    });
  });

  describe('RadioButton', () => {
    const subject = props =>
      render(
        <TestApp isHibanaEnabled={true}>
          <RadioButtonGroup.Button {...props} />
        </TestApp>,
      );

    it('renders with required props', () => {
      const mockFn = jest.fn();
      const { container } = subject({
        id: 'my-button',
        name: 'hello',
        value: 'my-button-yeah',
        checked: true,
        children: 'My Button',
        onChange: mockFn,
      });

      expect(container.querySelector('#my-button')).toBeTruthy();
      expect(container.querySelector('[name="hello"]')).toBeTruthy();
      expect(container.querySelector('[value="my-button-yeah"]')).toBeTruthy();
      expect(container.querySelector('[checked]')).toBeTruthy();
      expect(screen.getByLabelText('My Button')).toBeInTheDocument();
    });
  });
});
