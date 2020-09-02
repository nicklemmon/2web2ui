import { shallow } from 'enzyme';
import _ from 'lodash';
import React from 'react';
import cookie from 'js-cookie';
import { JoinPage } from '../JoinPage';
import { AFTER_JOIN_REDIRECT_ROUTE } from 'src/constants';
import * as constants from 'src/constants';
import * as analytics from 'src/helpers/analytics';
import config from '../../../config';
import * as segmentHelpers from 'src/helpers/segment';

const username = 'foo_bar';
let props;
let instance;
let wrapper;
let formValues;

jest.mock('js-cookie');
jest.mock('src/helpers/analytics');
segmentHelpers.segmentTrack = jest.fn();

describe('JoinPage', () => {
  beforeEach(() => {
    props = {
      params: {},
      account: {
        createError: null,
      },
      logout: jest.fn(),
      register: jest.fn(() => Promise.resolve({ username })),
      authenticate: jest.fn(() => Promise.resolve()),
      history: {
        push: jest.fn(),
      },
      isAWSsignUp: false,
      location: {
        pathname: '/join',
      },
      title: 'Sign Up',
      getCurrentUser: jest.fn(() => Promise.resolve()),
      updateUserUIOptions: jest.fn(),
    };
    formValues = {
      first_name: 'foo',
      last_name: 'bar',
      email: 'foo@bar.com',
      tou_accepted: true,
      email_opt_in: false,
      password: 'foobar',
    };

    wrapper = shallow(<JoinPage {...props} />);
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('render', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders errors', () => {
      instance.handleSignupFailure = jest.fn().mockReturnValue('Some error occurred');
      wrapper.setProps({ account: { createError: {} } }); //just to make it truthy
      expect(wrapper).toMatchSnapshot();
    });

    it('renders aws logo when signup from aws', () => {
      wrapper.setProps({ isAWSsignUp: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('registerSubmit', () => {
    beforeEach(() => {
      const allData = {
        sfdcid: 'abcd',
        src: 'Test Source',
        utm_source: 'test file',
        extra1: 'bar1',
        extra2: 'bar2',
      };
      instance.extractQueryParams = jest.fn().mockReturnValue({
        sfdcid: allData.sfdcid,
        attributionData: _.pick(allData, config.salesforceDataParams),
        creationParams: allData,
      });
      instance.trackSignup = jest.fn();
    });

    it('calls register with correct data', async () => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(props.register.mock.calls).toMatchSnapshot();
      expect(segmentHelpers.segmentTrack).toHaveBeenCalledWith(
        segmentHelpers.SEGMENT_EVENTS.ACCOUNT_CREATED,
      );
    });

    it('negates email_opt_in properly', async () => {
      formValues.email_opt_in = true;
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledWith(
        expect.objectContaining({
          salesforce_data: expect.objectContaining({
            email_opt_out: false,
          }),
        }),
      );
    });

    it('authenticates after successful register', async () => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(props.authenticate).toHaveBeenCalledWith('foo_bar', formValues.password);
    });

    it('gives username to analytics after successful registration', async () => {
      await instance.registerSubmit(formValues);
      expect(analytics.setVariable).toHaveBeenCalledWith('username', username);
    });

    it('tracks signup after successful registration', async () => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(analytics.trackFormSuccess).toHaveBeenCalledWith(constants.ANALYTICS_CREATE_ACCOUNT, {
        form_type: constants.ANALYTICS_CREATE_ACCOUNT,
      });
    });

    it('redirects to correct url upon auth', async () => {
      await instance.registerSubmit(formValues);
      expect(props.history.push).toHaveBeenCalledWith(AFTER_JOIN_REDIRECT_ROUTE, {
        plan: undefined,
      });
    });

    it('Preserves plan for later onboarding phases', async () => {
      const plan = 'a-man';
      wrapper.setProps({ params: { plan } });
      await instance.registerSubmit(formValues);
      expect(props.history.push).toHaveBeenCalledWith(AFTER_JOIN_REDIRECT_ROUTE, { plan });
    });

    it('navigtes to the rv page if product set to rv', async () => {
      wrapper.setProps({ params: { product: 'rv' } });
      await instance.registerSubmit(formValues);
      expect(props.history.push).toHaveBeenCalledWith('/onboarding/recipient-validation');
    });

    it('does not swallow exceptions', async () => {
      const err = new Error('some error');
      props.register.mockReturnValue(Promise.reject(err));

      await expect(instance.registerSubmit(formValues)).rejects.toThrowError(err);
    });
  });

  describe('extractQueryParams', () => {
    beforeEach(() => {
      cookie.getJSON.mockReturnValue({ sfdcid: '123', utm_source: 'script' });
    });

    it('returns correct data when value exists in cookie only', () => {
      expect(instance.extractQueryParams()).toMatchSnapshot();
    });

    it('returns correct data when cookie is absent', () => {
      cookie.getJSON.mockReturnValue(undefined);
      expect(instance.extractQueryParams()).toMatchSnapshot();
    });

    it('merges data from query params onto stored cookie data', () => {
      wrapper.setProps({ params: { sfdcid: 'overridden', utm_medium: 'new property' } });
      expect(instance.extractQueryParams()).toMatchSnapshot();
    });
  });
});
