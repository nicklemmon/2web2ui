import * as reports from '../reports';
import sparkpostApiRequest from '../helpers/sparkpostApiRequest';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Action Creator: Reports', () => {
  it('it makes request to save a new report', async () => {
    await reports.createReport({ name: 'Report 1', description: 'My Report', is_editable: false });
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'CREATE_REPORT',
      meta: {
        method: 'POST',
        url: '/v1/reports',
        data: {
          description: 'My Report',
          is_editable: false,
          name: 'Report 1',
        },
      },
    });
  });
});
