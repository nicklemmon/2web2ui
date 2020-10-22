import React from 'react';
import { shallow, mount } from 'enzyme';
import TestApp from 'src/__testHelpers__/TestApp';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import { UploadedListPage } from '../UploadedListPage';
import styles from '../UploadedListPage.module.scss';

jest.mock('src/hooks/useHibanaOverride');

jest.mock('src/pages/recipientValidation/components/ListProgress', () => {
  return () => {
    return [];
  };
});

describe('UploadedListPage', () => {
  beforeEach(() => {
    useHibanaOverride.mockReturnValue(styles);
  });

  const subject = (props = {}, method = shallow) => {
    const component = (
      <UploadedListPage
        getJobStatus={() => {}}
        getBillingInfo={() => {}}
        getBillingSubscription={() => {}}
        listId="A1C1_D1C1"
        job={{
          jobId: 'A1C1_D1C1',
          status: 'success',
          updatedAt: '1997-11-21T15:55:06Z',
        }}
        jobLoadingStatus="success"
        triggerJob={() => {}}
        billing={{}}
        handleSubmit={() => {}}
        {...props}
      />
    );

    if (method === mount) {
      return mount(<TestApp>{component}</TestApp>);
    }

    return method(component);
  };

  it('renders with list progress', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('calls getJobStatus on mount', () => {
    const getJobStatus = jest.fn();
    subject({ getJobStatus }, mount);
    expect(getJobStatus).toHaveBeenCalledWith('A1C1_D1C1');
  });

  it('redirects and alerts when loading fails', () => {
    const wrapper = subject({ job: undefined, jobLoadingStatus: 'fail' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading', () => {
    const wrapper = subject({ job: undefined, jobLoadingStatus: 'pending' });
    expect(wrapper).toHaveDisplayName('Loading');
  });

  it('renders the list error when the job status is error', () => {
    const wrapper = subject({
      job: {
        jobId: 'A1C1_D1C1',
        status: 'error',
        updatedAt: '1997-11-21T15:55:06Z',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  describe('when job is queued', () => {
    const queuedSubject = (props = {}) =>
      subject({
        job: {
          jobId: 'B1C1_D1C1',
          status: 'queued_for_batch',
          updatedAt: '1997-11-21T15:55:06Z',
        },
        listId: 'B1C1_D1C1',
        ...props,
      });

    it('render with upload form when job is queued', () => {
      const wrapper = queuedSubject();
      expect(wrapper.find('Connect(UploadedListForm)')).toExist();
    });

    it('calls triggerJob when form is submitted', () => {
      const triggerJob = jest.fn(a => Promise.resolve(a));
      const wrapper = queuedSubject({ triggerJob });

      wrapper.find('Connect(UploadedListForm)').simulate('submit');

      expect(triggerJob).toHaveBeenCalledWith('B1C1_D1C1');
    });
  });

  describe('when standaloneRV flag is set', () => {
    it('render a ValidateSection when job status is queued for batch', () => {
      expect(
        subject({
          isStandAloneRVSet: true,
          job: {
            jobId: 'B1C1_D1C1',
            status: 'queued_for_batch',
            updatedAt: '1997-11-21T15:55:06Z',
          },
          listId: 'B1C1_D1C1',
        }).find('Connect(ValidateSection)'),
      ).toHaveLength(1);
    });
  });
});
