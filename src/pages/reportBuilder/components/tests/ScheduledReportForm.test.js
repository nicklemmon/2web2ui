import { render, screen } from '@testing-library/react';
import React from 'react';
import { ScheduledReportForm, formatFormValues } from '../ScheduledReportForm';
import TestApp from 'src/__testHelpers__/TestApp';

describe('ScheduledReportForm', () => {
  const mockSubmit = jest.fn();
  const mockListUsers = jest.fn();
  const subject = props => {
    const defaults = {
      report: { name: 'test report', id: 'abc123' },
      handleSubmit: mockSubmit,
      listUsers: mockListUsers,
      loading: false,
      users: [
        { username: 'bob', email: 'bob@theBuilder.com' },
        { username: 'bob2', email: 'bob2@theBuilder.com' },
      ],
    };

    return render(
      <TestApp isHibanaEnabled={true}>
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
    };
    const formattedValuesBase = {
      name: 'test',
      recipients: ['bob'],
      subject: 'meh',
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
        description: 'NA',
        schedule: {
          day_of_month: '*',
          day_of_week: '*',
          hour: 0,
          minute: 0,
          month: '*',
          second: 0,
        },
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
        description: 'NA',
        schedule: {
          day_of_month: '*',
          day_of_week: '*',
          hour: 13,
          minute: 30,
          month: '*',
          second: 0,
        },
      };
      expect(formatFormValues(rawFormValues)).toEqual(expected);
    });

    it('formats form values for weekly schedule correctly', () => {
      const rawFormValues = {
        ...formValuesBase,
        day: '1',
        period: 'PM',
        time: '1:30',
        timing: 'weekly',
      };
      const expected = {
        ...formattedValuesBase,
        description: 'NA',
        schedule: {
          day_of_month: '*',
          day_of_week: '1',
          hour: 13,
          minute: 30,
          month: '*',
          second: 0,
        },
      };
      expect(formatFormValues(rawFormValues)).toEqual(expected);
    });
  });
});
