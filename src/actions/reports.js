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

export function updateReport({ id, ...data }) {
  return sparkpostApiRequest({
    type: 'UPDATE_REPORT',
    meta: {
      method: 'PUT',
      url: `/v1/reports/${id}`,
      data,
    },
  });
}

export function getReports() {
  return sparkpostApiRequest({
    type: 'GET_REPORTS',
    meta: {
      method: 'GET',
      url: '/v1/reports',
    },
  });
}

export function deleteReport(id) {
  return sparkpostApiRequest({
    type: 'DELETE_REPORT',
    meta: {
      method: 'DELETE',
      url: `/v1/reports/${id}`,
    },
  });
}
