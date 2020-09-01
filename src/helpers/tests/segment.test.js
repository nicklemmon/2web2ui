import { segmentIdentify, SEGMENT_TRAITS, segmentPage } from '../segment';

describe('segment helpers', () => {
  describe('segmentIdentify', () => {
    beforeEach(() => {
      window.analytics = {};
      window.analytics.identify = jest.fn();
    });

    it('does not pass invalid traits to segment', () => {
      const traits = {
        [SEGMENT_TRAITS.CUSTOMER_ID]: 123,
        [SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
        [SEGMENT_TRAITS.USER_ID]: 'username',
        'invalid-trait': 'this-is-invalid',
      };
      segmentIdentify(traits);
      expect(window.analytics.identify).toBeCalledWith('email@abc.com//123', {
        [SEGMENT_TRAITS.CUSTOMER_ID]: 123,
        [SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
        [SEGMENT_TRAITS.USER_ID]: 'username',
      });
    });

    it('does not call window.analytics.identify without user id/email', () => {
      const traits = {
        [SEGMENT_TRAITS.CUSTOMER_ID]: 123,
        [SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
        [SEGMENT_TRAITS.TENANT]: 'test-tenant',
      };
      segmentIdentify(traits);
      expect(window.analytics.identify).toBeCalledTimes(0);
    });

    it('calls window.analytics.identify with the correct id', () => {
      const traits = {
        [SEGMENT_TRAITS.CUSTOMER_ID]: 123,
        [SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
        [SEGMENT_TRAITS.USER_ID]: 'username',
        [SEGMENT_TRAITS.TENANT]: 'test-tenant',
      };

      segmentIdentify(traits);
      expect(window.analytics.identify).toBeCalledWith('email@abc.com//123', traits);
    });
  });

  describe('segmentPage', () => {
    it('calls window.analytics.page when it is set', () => {
      window.analytics = {};
      window.analytics.page = jest.fn();

      segmentPage();
      expect(window.analytics.page).toBeCalled();
    });
  });
});
