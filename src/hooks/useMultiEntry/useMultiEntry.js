import { useReducer } from 'react';
import _ from 'lodash';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_VALUES':
      if (action.value.length === 0) {
        return { ...state };
      }

      // This helps when the user pastes in values with spaces
      if (action.value.includes(' ')) {
        const additionalValues = action.value.split(' ');

        return { ...state, value: '', valueList: [...state.valueList, ...additionalValues] };
      }

      return { ...state, value: '', valueList: [...state.valueList, action.value] };

    case 'REMOVE_VALUE': {
      // Filter out any values that match the target for removal
      const valueList = state.valueList.filter(item => {
        return !_.isEqual(action.value, item);
      });

      return { ...state, valueList };
    }

    case 'REMOVE_LAST_VALUE': {
      const valueList = state.valueList.filter(
        (_value, index) => index + 1 !== state.valueList.length,
      );

      return {
        ...state,
        valueList,
      };
    }

    case 'VALUE_CHANGE':
      return { ...state, value: action.value };

    default:
      throw new Error(`${action.type} is not supported by useComboBox.`);
  }
}

const defaultInitialState = {
  value: '',
  valueList: [],
};

export default function useComboBox(initialState) {
  const [state, dispatch] = useReducer(reducer, { ...defaultInitialState, ...initialState });

  function handleKeyDown(e) {
    // Spacebar or enter key
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();

      return dispatch({ type: 'UPDATE_VALUES', value: e.target.value });
    }
  }

  function handleRemove(target) {
    return dispatch({ type: 'REMOVE_VALUE', value: target });
  }

  function handleChange(e) {
    return dispatch({ type: 'VALUE_CHANGE', value: e.target.value });
  }

  function handleBlur(e) {
    return dispatch({ type: 'UPDATE_VALUES', value: e.target.value });
  }

  return {
    value: state.value,
    valueList: state.valueList,
    handleKeyDown,
    handleBlur,
    handleChange,
    handleRemove,
  };
}
