/* eslint-disable max-lines */
import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateUtils } from 'react-day-picker';
import { subMonths, format } from 'date-fns';
import {
  getStartOfDay,
  getEndOfDay,
  getRelativeDateOptions,
  getRelativeDates,
  getNextHour,
  isSameDate,
} from 'src/helpers/date';
import { roundBoundaries, getRollupPrecision, getPrecision } from 'src/helpers/metrics';
import {
  ActionList,
  Box,
  Button,
  DatePicker as DateSelector,
  Error,
  Popover,
  TextField,
  WindowEvent,
} from 'src/components/matchbox';
import ButtonWrapper from 'src/components/buttonWrapper';
import ManualEntryForm from './ManualEntryForm';
import { FORMATS } from 'src/constants';
import styles from './DatePicker.module.scss';

const DATE_FORMAT = FORMATS.LONG_DATETIME;

const initialState = {
  showDatePicker: false,
  selecting: false,
  relativeRange: 'custom',
  selected: {},
  validationError: null,
  selectedPrecision: undefined,
};

const actionTypes = {
  open: 'OPEN',
  close: 'CLOSE',
  error: 'SET_ERROR',
  sync: 'SYNC',
  dayClick: 'DAY_CLICK',
  dayHover: 'DAY_HOVER',
  selectRange: 'SELECT_RANGE',
  setFormDates: 'SET_FORM_DATES',
};

const datePickerReducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.open: {
      return { ...state, showDatePicker: true };
    }
    case actionTypes.close: {
      return { ...state, showDatePicker: false, selecting: false, validationError: null };
    }
    case actionTypes.error: {
      const { validationError } = payload;
      return { ...state, validationError };
    }
    case actionTypes.sync:
    case actionTypes.dayClick:
    case actionTypes.dayHover:
    case actionTypes.selectRange:
    case actionTypes.setFormDates:
      return { ...state, ...payload };
    default: {
      return state;
    }
  }
};
export function DatePicker(props) {
  const [state, dispatch] = useReducer(datePickerReducer, initialState);

  const syncTimeToState = useCallback(
    ({ from, to, precision, relativeRange }) => {
      if (from && to) {
        const selectedPrecision = props.selectPrecision && precision;
        dispatch({
          type: actionTypes.sync,
          payload: {
            selected: { from, to },
            selectedPrecision,
            relativeRange,
            selecting: false,
          },
        });
      }
    },
    [props.selectPrecision],
  );

  useEffect(() => {
    syncTimeToState({
      to: props.to,
      from: props.from,
      precision: props.precision,
      relativeRange: props.relativeRange,
    });
  }, [props.to, props.from, props.precision, props.relativeRange, syncTimeToState]);

  // Closes popover on escape, submits on enter
  const handleKeyDown = e => {
    if (!state.showDatePicker) {
      return;
    }

    if (e.key === 'Escape') {
      cancelDatePicker();
    }

    if (!state.selecting && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleDayKeyDown = (day, modifiers, e) => {
    handleKeyDown(e);
    e.stopPropagation();
  };

  const cancelDatePicker = () => {
    syncTimeToState(props);
    dispatch({ type: actionTypes.close });
  };

  const showDatePicker = () => {
    dispatch({ type: actionTypes.open });
  };

  const handleDayClick = clicked => {
    const { selecting, selected } = state;
    const { validate, selectPrecision } = props;

    const dates = selecting
      ? selected
      : {
          from: fromFormatter(clicked),
          to: getEndOfDay(clicked, { preventFuture: props.preventFuture }),
        };

    const validationError = validate && validate(dates);

    if (selecting && validationError) {
      dispatch({ type: actionTypes.error, payload: { validationError } });
      return;
    }

    dispatch({
      type: actionTypes.dayClick,
      payload: {
        relativeRange: 'custom',
        selected: dates,
        beforeSelected: dates,
        selecting: !selecting,
        validationError: null,
        selectedPrecision:
          selectPrecision &&
          getRollupPrecision({ from: dates.from, to: dates.to, precision: props.precision }),
      },
    });
  };

  const handleDayHover = hovered => {
    const { selecting } = state;

    if (selecting) {
      const { from, to, precision } = getOrderedRange(hovered);
      dispatch({
        type: actionTypes.dayHover,
        payload: { selected: { from, to }, selectedPrecision: precision },
      });
    }
  };

  const getOrderedRange = newDate => {
    let { from, to } = state.beforeSelected;
    const { preventFuture, selectPrecision, precision: oldPrecision } = props;
    if (from.getTime() <= newDate.getTime()) {
      to = getEndOfDay(newDate, { preventFuture });
    } else {
      from = fromFormatter(newDate);
    }
    //Changes datepicker precision if the current set precision is not available
    const precision = getRollupPrecision({
      from,
      to,
      precision: selectPrecision && oldPrecision,
    });
    if (props.roundToPrecision) {
      const rounded = roundBoundaries({ from, to, precision });
      from = rounded.from.toDate();
      to = rounded.to.toDate();
    }
    return { from, to, precision };
  };

  const handleSelectRange = value => {
    const { selectedPrecision: precision } = state;
    if (value !== 'custom') {
      const { from, to } = getRelativeDates(value, { precision });

      dispatch({
        type: actionTypes.selectRange,
        payload: {
          selecting: false,
          relativeRange: value,
          selectedPrecision: precision,
          selected: { from, to },
        },
      });
    } else {
      dispatch({
        type: actionTypes.selectRange,
        payload: {
          relativeRange: value,
        },
      });
    }
  };

  const handleFormDates = ({ from, to, precision }, callback) => {
    const selectedPrecision = props.selectPrecision ? precision : undefined;

    dispatch({
      type: actionTypes.setFormDates,
      payload: { selected: { from, to }, selectedPrecision, relativeRange: 'custom' },
    });
    callback();
  };

  const handleSubmit = () => {
    const { validate } = props;
    const selectedDates = state.selected;
    const validationError = validate && validate(selectedDates);
    if (validationError) {
      dispatch({ type: actionTypes.error, payload: { validationError } });
      return;
    }

    dispatch({ type: actionTypes.close });
    props.onChange({
      ...selectedDates,
      relativeRange: state.relativeRange,
      precision:
        state.selectedPrecision ||
        getPrecision(moment(selectedDates.from), moment(selectedDates.to)),
    });
  };

  const handleTextUpdate = () => {
    if (props.onBlur) {
      props.onBlur();
    }
  };

  const fromFormatter = fromDate => {
    const isDateToday = isSameDate(getStartOfDay(fromDate), getStartOfDay(new Date()));
    const formatter = props.fromSelectsNextHour && isDateToday ? getNextHour : getStartOfDay;
    return formatter(fromDate);
  };

  const {
    selected: { from, to },
    validationError,
    selectedPrecision,
  } = state;

  // allow for prop-level override of "now" (DI, etc.)
  const {
    now = new Date(),
    relativeDateOptions = [],
    disabled,
    datePickerProps = {},
    textFieldProps = {},
    dateFieldFormat,
    roundToPrecision,
    preventFuture,
    // showPresets = true,
    error,
    left,
    hideManualEntry,
    precision,
    selectPrecision,
    id,
    label,
  } = props;

  const dateFormat = dateFieldFormat || DATE_FORMAT;

  const rangeOptions = getRelativeDateOptions(relativeDateOptions).map(({ label, value }) => {
    return {
      content: label,
      highlighted: state.relativeRange === value,
      onClick: () => handleSelectRange(value),
    };
  });

  const modifiers = {
    firstSelected: day => {
      return DateUtils.isSameDay(day, from);
    },
    lastSelected: day => DateUtils.isSameDay(day, to),
    inBetween: day => DateUtils.isDayBetween(day, from, to),
  };

  const dateField = (
    <TextField
      date-id={`date-field-${id}`}
      label={label}
      id={`date-field-${id}`}
      onClick={showDatePicker}
      value={`${format(from, dateFormat)} – ${format(to, dateFormat)}`}
      readOnly
      onBlur={handleTextUpdate}
      error={error}
      disabled={disabled}
      type="text"
      {...textFieldProps}
    />
  );

  return (
    <Popover
      id={`popover-${id}`}
      as="div"
      className={styles.Popover}
      trigger={dateField}
      onClose={cancelDatePicker}
      open={state.showDatePicker}
      left={left}
    >
      <Box display="flex">
        <Box className={styles.ActionList} borderRight="400">
          <ActionList actions={rangeOptions} />
        </Box>
        <Box padding="400" className={styles.DateSelectorWrapper}>
          <DateSelector
            data-id="date-selector"
            modifiers={modifiers}
            className={styles.DateSelector}
            fixedWeeks
            initialMonth={subMonths(now, 1)}
            toMonth={now}
            disabledDays={{ after: now }}
            onDayClick={handleDayClick}
            onDayMouseEnter={handleDayHover}
            onDayFocus={handleDayHover}
            onKeyDown={handleKeyDown}
            onDayKeyDown={handleDayKeyDown}
            selectedDays={state.selected}
            {...datePickerProps}
          />
          {!hideManualEntry && (
            <ManualEntryForm
              data-id="manual-entry-form"
              selectDates={handleFormDates}
              onEnter={handleKeyDown}
              to={to}
              from={from}
              roundToPrecision={roundToPrecision}
              preventFuture={preventFuture}
              selectedPrecision={selectedPrecision}
              defaultPrecision={selectPrecision && precision}
            />
          )}
        </Box>
      </Box>
      <Box padding="400" borderTop="400">
        <ButtonWrapper>
          <Button variant="primary" onClick={handleSubmit} data-id="date-picker-custom-apply">
            Apply
          </Button>

          <Button variant="secondary" onClick={cancelDatePicker}>
            Cancel
          </Button>
        </ButtonWrapper>
      </Box>
      {validationError && (
        <span className={styles.Error}>
          <Error wrapper="span" error={validationError}></Error>
        </span>
      )}
      <WindowEvent event="keydown" handler={handleKeyDown} />
    </Popover>
  );
}

export default DatePicker;

DatePicker.propTypes = {
  now: PropTypes.instanceOf(Date),
  from: PropTypes.instanceOf(Date),
  to: PropTypes.instanceOf(Date),
  relativeRange: PropTypes.string,
  relativeDateOptions: PropTypes.arrayOf(PropTypes.string),
  roundToPrecision: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  datePickerProps: PropTypes.object,
  dateFieldFormat: PropTypes.string,
  disabled: PropTypes.bool,
  showPresets: PropTypes.bool,
  hideManualEntry: PropTypes.bool,
  selectPrecision: PropTypes.bool,
  id: PropTypes.string,
};

DatePicker.defaultProps = {
  preventFuture: true,
  roundToPrecision: false,
  id: 'date-picker',
};
