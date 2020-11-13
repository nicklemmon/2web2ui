import { render, screen } from '@testing-library/react';
import React from 'react';

import { ScheduledReportForm, formatFormValues } from '../ScheduledReportForm';
import { listUsers } from 'src/actions/users';
import TestApp from 'src/__testHelpers__/TestApp';

jest.mock('src/selectors/users', () => ({
  selectUsers: jest.fn().mockReturnValue([
    { username: 'bob', email: 'bob@theBuilder.com' },
    { username: 'bob2', email: 'bob2@theBuilder.com' },
  ]),
}));
jest.mock('src/actions/users');

const store = {
  users: { loading: false },
  reports: { saveScheduledReportStatus: 'idle' },
};

describe('ScheduledReportForm', () => {
  const mockSubmit = jest.fn();
  listUsers.mockImplementation(() => jest.fn());
  const subject = props => {
    const defaults = {
      report: { name: 'test report', id: 'abc123' },
      handleSubmit: mockSubmit,
    };

    return render(
      <TestApp isHibanaEnabled={true} store={store}>
        <ScheduledReportForm {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders page correctly', () => {
    subject();
    expect(screen.getByText('Scheduled Report Name')).toBeVisible();
    expect(screen.getByText('test report')).toBeVisible();
    expect(screen.getByText('reports@sparkpost.com')).toBeVisible();
    expect(screen.getByText('Email Subject')).toBeVisible();
    expect(screen.getByText('Send To')).toBeVisible();
    expect(screen.getByText('Send Report')).toBeVisible();
    expect(screen.getByText('Daily')).toBeVisible();
    expect(screen.getByText('Weekly')).toBeVisible();
    expect(screen.getByText('Monthly')).toBeVisible();
    expect(screen.getByText('Week')).toBeVisible();
    expect(screen.getByText('Day')).toBeVisible();
    expect(screen.getByText('Time')).toBeVisible();
    expect(screen.getByText('Time Zone')).toBeVisible();
  });

  describe('formatting form values', () => {
    const formValuesBase = {
      name: 'test',
      recipients: [{ username: 'bob', email: 'bob@ross.com', extra: true }],
      subject: 'meh',
      timezone: 'America/New_York',
    };
    const formattedValuesBase = {
      name: 'test',
      recipients: ['bob'],
      subject: 'meh',
      timezone: 'America/New_York',
    };

    it('formats form values for daily schedule correctly', () => {
      const rawFormValues = {
        ...formValuesBase,
        day: undefined,
        period: 'AM',
        time: '12:00',
        timing: 'daily',
      };
      const expected = {
        ...formattedValuesBase,
        schedule: {
          day_of_month: '?',
          day_of_week: '*',
          hour: 0,
          minute: 0,
          month: '*',
          second: 0,
        },
        schedule_type: 'daily',
      };
      expect(formatFormValues(rawFormValues)).toEqual(expected);
    });

    it('formats form values for daily PM schedule correctly', () => {
      const rawFormValues = {
        ...formValuesBase,
        day: undefined,
        period: 'PM',
        time: '1:30',
        timing: 'daily',
      };
      const expected = {
        ...formattedValuesBase,
        schedule: {
          day_of_month: '?',
          day_of_week: '*',
          hour: 13,
          minute: 30,
          month: '*',
          second: 0,
        },
        schedule_type: 'daily',
      };
      expect(formatFormValues(rawFormValues)).toEqual(expected);
    });

    it('formats form values for weekly schedule correctly', () => {
      const rawFormValues = {
        ...formValuesBase,
        week: '#2',
        day: 'mon',
        period: 'PM',
        time: '1:30',
        timing: 'weekly',
      };
      const expected = {
        ...formattedValuesBase,
        schedule: {
          day_of_month: '?',
          day_of_week: 'mon',
          hour: 13,
          minute: 30,
          month: '*',
          second: 0,
        },
        schedule_type: 'weekly',
      };
      expect(formatFormValues(rawFormValues)).toEqual(expected);
    });

    it('formats form values for monthly schedule correctly', () => {
      const rawFormValues = {
        ...formValuesBase,
        week: 'l',
        day: 'fri',
        period: 'PM',
        time: '1:30',
        timing: 'monthly',
      };
      const expected = {
        ...formattedValuesBase,
        schedule: {
          day_of_month: '?',
          day_of_week: 'fril',
          hour: 13,
          minute: 30,
          month: '*',
          second: 0,
        },
        schedule_type: 'monthly',
      };
      expect(formatFormValues(rawFormValues)).toEqual(expected);
    });
  });
});
