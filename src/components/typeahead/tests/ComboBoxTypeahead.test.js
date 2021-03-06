import React, { useCallback } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { useDebouncedCallback } from 'use-debounce';
import TestApp from 'src/__testHelpers__/TestApp';
import { ComboBoxTypeahead } from '../ComboBoxTypeahead';

jest.mock('use-debounce');

describe('ComboBoxTypeahead', () => {
  const subject = (props = {}) =>
    mount(
      <TestApp>
        <ComboBoxTypeahead
          value={[]}
          onChange={() => {}}
          results={[
            'apple',
            'banana',
            'blue ',
            'cauliflower',
            'grape',
            'grapefruit',
            'orange',
            'pineapple',
          ]}
          {...props}
        />
      </TestApp>,
    );

  const changeInputValue = (wrapper, nextValue) => {
    const fakeEvent = { target: { value: nextValue } };

    act(() => {
      // simulate a input value change
      // todo, `simulate('change', fakeEvent)` doesn't work
      find(wrapper, 'ComboBoxTextField').prop('onChange')(fakeEvent);
    });

    wrapper.update(); // ugh
  };

  // todo, our matchbox wrapper forces us to call first
  const find = (wrapper, selector) => wrapper.find(selector).first();

  const selectMenuItem = (wrapper, itemIndex) => {
    const fakeEvent = jest.fn();
    const menuItem = find(wrapper, 'ComboBoxMenu').prop('items')[itemIndex];

    act(() => {
      // click menu item to simulate selection
      menuItem.onClick(fakeEvent, menuItem.content);
    });

    wrapper.update(); // ugh
  };

  beforeEach(() => {
    // need to memoize with useCallback
    useDebouncedCallback.mockImplementation(fn => [useCallback(fn, [])]);
  });

  it('renders max number of menu items', () => {
    const wrapper = subject({ maxNumberOfResults: 5 });
    const items = find(wrapper, 'ComboBoxMenu').prop('items');
    expect(items).toHaveLength(5);
  });

  it('renders filtered menu items', () => {
    const wrapper = subject();
    changeInputValue(wrapper, 'grape');
    const items = find(wrapper, 'ComboBoxMenu').prop('items');
    expect(items).toHaveLength(2);
  });

  it('renders filtered menu items without selected items', () => {
    const wrapper = subject({ value: ['grape'] });
    changeInputValue(wrapper, 'grape');
    const items = find(wrapper, 'ComboBoxMenu').prop('items');
    expect(items).toHaveLength(1);
  });

  it('renders filtered menu items without exclusive items', () => {
    const wrapper = subject({
      value: ['B'],
      results: ['A', 'B', 'C'],
      isExclusiveItem: item => item === 'A',
    });
    const items = find(wrapper, 'ComboBoxMenu').prop('items');

    expect(items).toHaveLength(1);
  });

  it('does not render a menu when no matches', () => {
    const wrapper = subject();
    changeInputValue(wrapper, 'xyz');
    expect(find(wrapper, 'ComboBoxMenu')).toHaveProp('isOpen', false);
  });

  it('leaves menu open after a selection', () => {
    const wrapper = subject();
    selectMenuItem(wrapper, 0);
    expect(find(wrapper, 'ComboBoxMenu')).toHaveProp('isOpen', true);
  });

  it('closes menu when exclusive item is selected', () => {
    const wrapper = subject({
      results: ['My Example'],
      isExclusiveItem: item => item === 'My Example',
    });
    selectMenuItem(wrapper, 0);
    expect(find(wrapper, 'ComboBoxMenu')).toHaveProp('isOpen', false);
  });

  it('resets input value after a selection', () => {
    const wrapper = subject();
    changeInputValue(wrapper, 'app');
    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('value', 'app');
    selectMenuItem(wrapper, 0);
    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('value', '');
  });

  it('opens menu on focus', () => {
    const wrapper = subject();

    act(() => {
      // todo, `simulate('focus')` doesn't work
      find(wrapper, 'ComboBoxTextField').prop('onFocus')();
    });

    wrapper.update();

    expect(find(wrapper, 'ComboBoxMenu')).toHaveProp('isOpen', true);
  });

  it('disables text field', () => {
    const wrapper = subject({ disabled: true });
    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('disabled', true);
  });

  it('enabled read only mode for text field', () => {
    const wrapper = subject({ readOnly: true });
    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('readOnly', true);
  });

  it('enabled read only mode for text field when an exclusive item is selected', () => {
    const wrapper = subject({
      results: ['My Example'],
      isExclusiveItem: item => item === 'My Example',
    });
    selectMenuItem(wrapper, 0);
    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('readOnly', true);
  });

  it('renders placeholder message when no items have been selected', () => {
    const wrapper = subject({ placeholder: 'Do something!' });
    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('placeholder', 'Do something!');
  });

  it('does not render placeholder message when items have been selected', () => {
    const wrapper = subject({ value: ['apple'], placeholder: 'Do something!' });
    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('placeholder', '');
  });

  it('controls selected items from parent component', () => {
    const selectedItems = ['apple', 'banana'];
    const wrapper = subject({ value: selectedItems });

    wrapper.update();

    expect(find(wrapper, 'ComboBoxTextField')).toHaveProp('selectedItems', selectedItems);
  });

  it('calls onChange on mount', () => {
    const onChange = jest.fn();
    subject({ value: ['pineapple'], onChange });
    expect(onChange).toHaveBeenCalledWith(['pineapple']);
  });

  it('calls onChange when selected item is added', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange });

    selectMenuItem(wrapper, 0);

    expect(onChange).toHaveBeenCalledWith(['apple']);
  });

  it('calls onChange when selected item is removed', () => {
    const onChange = jest.fn();
    const wrapper = subject({ value: ['apple', 'pineapple'], onChange });

    act(() => {
      find(wrapper, 'ComboBoxTextField').prop('removeItem')('pineapple');
    });

    expect(onChange).toHaveBeenCalledWith(['apple']);
  });

  it('renders help text', () => {
    const wrapper = subject({ helpText: 'Did you know?' });
    expect(wrapper).toHaveTextContent('Did you know?');
  });
});
