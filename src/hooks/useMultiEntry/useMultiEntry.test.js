import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMultiEntry } from 'src/hooks';
import { ComboBoxTextField } from 'src/components/matchbox';
import TestApp from 'src/__testHelpers__/TestApp';

function UseMultiEntryDemo(props) {
  const { initialValue = '', initialValueList = [] } = props;
  const {
    value,
    valueList,
    handleKeyDown,
    handleChange,
    handleBlur,
    handleRemove,
  } = useMultiEntry({ value: initialValue, valueList: initialValueList });

  return (
    <TestApp isHibanaEnabled={true}>
      <ComboBoxTextField
        id="my-combo-box"
        removeItem={handleRemove}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        label="Filters"
        value={value}
        selectedItems={valueList}
        itemToString={value => value}
      />
    </TestApp>
  );
}

describe('useMultiEntry', () => {
  function getComboBox() {
    return screen.getByLabelText('Filters');
  }

  it('renders with passed in initial values', () => {
    render(<UseMultiEntryDemo initialValue="whatup" initialValueList={['hello', 'world']} />);

    expect(getComboBox()).toHaveValue('whatup');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);
  });

  it('renders the input value on change', () => {
    render(<UseMultiEntryDemo />);

    userEvent.type(getComboBox(), 'hello!');

    expect(getComboBox()).toHaveValue('hello!');
  });

  it('adds a value when the user hits "space"', () => {
    render(<UseMultiEntryDemo />);
    userEvent.type(getComboBox(), 'hello{space}');

    expect(getComboBox()).toHaveValue('');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1);

    userEvent.type(getComboBox(), 'world{space}');

    expect(getComboBox()).toHaveValue('');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);
  });

  it('adds a value when the user hits "enter"', () => {
    render(<UseMultiEntryDemo />);
    userEvent.type(getComboBox(), 'hello{enter}');

    expect(getComboBox()).toHaveValue('');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1);

    userEvent.type(getComboBox(), 'world{enter}');

    expect(getComboBox()).toHaveValue('');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);
  });

  it('adds a value when the user blurs the field', () => {
    render(<UseMultiEntryDemo />);
    userEvent.type(getComboBox(), 'hello');
    userEvent.tab();

    expect(getComboBox()).toHaveValue('');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1);

    userEvent.type(getComboBox(), 'world');
    userEvent.tab();

    expect(getComboBox()).toHaveValue('');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);
  });

  it('removes values when hitting backspace', () => {
    render(<UseMultiEntryDemo />);
    userEvent.type(getComboBox(), 'hello{space}');
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1);
    userEvent.type(getComboBox(), '{backspace}');

    expect(screen.queryByText('hello')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'Remove' })).toHaveLength(0);
    expect(getComboBox()).toHaveValue('');
  });

  it('adds a series of new values when the parsed value contains spaces (i.e., when the user pastes in content)', () => {
    render(<UseMultiEntryDemo initialValue="the new tags" initialValueList={['hello', 'world']} />);

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);

    // Adds the new tags by triggering the relevant event
    userEvent.type(getComboBox(), '{space}');

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getByText('the')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('tags')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(5);
  });

  it('removes values when clicking the "Remove" buttons', () => {
    render(<UseMultiEntryDemo />);
    userEvent.type(getComboBox(), 'hello{space}world{space}again');
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });

    // Blurring the field and clicking creates a new tag for "again" without having to click space
    // Clicking the remove button for the "world" tag
    userEvent.click(removeButtons[1]);

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.queryByText('world')).not.toBeInTheDocument();
    expect(screen.getByText('again')).toBeInTheDocument();

    // Clicking the remove button for the "hello" tag
    userEvent.click(removeButtons[0]);

    expect(screen.queryByText('hello')).not.toBeInTheDocument();
    expect(screen.getByText('again')).toBeInTheDocument();

    // Clicking the remove button for the "again" tag
    userEvent.click(removeButtons[0]);

    expect(screen.queryByText('again')).not.toBeInTheDocument();
  });
});
