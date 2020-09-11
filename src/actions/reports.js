import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function createReport(data) {
  return sparkpostApiRequest({
    type: 'CREATE_REPORT',
    meta: {
      method: 'POST',
      url: '/v1/reports',
      data,
    },
  });
}
