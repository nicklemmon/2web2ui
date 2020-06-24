import cases from 'jest-in-case';
import ErrorTracker, {
  breadcrumbCallback,
  getEnricherOrDieTryin,
  isApiError,
  isErrorFromOurBundle,
  isChunkFailure,
} from '../errorTracker';
import mockBowser from 'bowser';
import * as mockRaven from 'raven-js';

jest.mock('raven-js');
jest.mock('bowser');

describe('.breadcrumbCallback', () => {
  it('returns false with breadcrumb for ignored action', () => {
    expect(breadcrumbCallback({ message: '@@redux-form/CHANGE' })).toBeFalsy();
  });

  it('returns breadcrumb', () => {
    const breadcrumb = { message: 'RECORD_ME' };
    expect(breadcrumbCallback(breadcrumb)).toEqual(breadcrumb);
  });
});

cases(
  '.getEnricherOrDieTryin',
  ({ currentWindow = {}, data = {}, state = {} }) => {
    mockBowser.getParser = jest.fn(userAgent => ({
      satisfies: jest.fn(() => {
        // return undefined like bowser when browser is unsupported
        // see, https://github.com/lancedikson/bowser/blob/700732f7b3f490cb61f9f4d34142d0a9ea5a38d3/index.d.ts#L177
        if (userAgent === 'unsupported') {
          return;
        }
        return true;
      }),
    }));

    const getState = jest.fn(() => state);
    const enrich = getEnricherOrDieTryin({ getState }, currentWindow);

    expect(enrich({ logger: 'test', ...data })).toMatchSnapshot();
  },
  {
    'by default': {},
    'with current user': {
      state: {
        currentUser: {
          id: 123, // should be ignored
          access_level: 'admin',
          customer: 123,
          username: 'test-user',
          options: {
            ui: {
              isHibanaEnabled: true,
            },
          },
        },
      },
    },
    'with document language': {
      currentWindow: {
        document: {
          documentElement: { lang: 'af' },
        },
      },
    },
    'with navigator language': {
      currentWindow: {
        navigator: { language: 'en-US' },
      },
    },
    'with tags': {
      data: {
        tags: { tenant: 'test' },
      },
    },
    'with error from our bundle': {
      data: {
        exception: {
          values: [
            {
              stacktrace: {
                frames: [{ filename: 'sparkpost.com/static/js/bundle.js', function: 'test' }],
              },
            },
          ],
        },
      },
    },
    'with api error': {
      data: {
        exception: {
          values: [{ type: 'SparkpostApiError' }],
        },
      },
    },
    'with chunk loading error': {
      data: {
        exception: {
          values: [{ value: 'Loading chunk 4 failed.' }],
        },
      },
    },
    'with unsupported browser': {
      currentWindow: {
        navigator: { userAgent: 'unsupported' },
      },
    },
    'with password reset token': {
      data: {
        request: {
          url: 'https://not-a-real-tenant.example.com/reset-password/long-secret-reset-token',
        },
      },
    },
    'with email verification token': {
      data: {
        request: {
          url:
            'https://not-a-real-tenant.example.com/account/email-verification/long-verification-token',
        },
      },
    },
    'with other request fields': {
      data: {
        request: {
          url: 'https://not-a-real-tenant.example.com/nice-route',
          headers: {
            Referer: 'https://not-a-real-tenant.example.com/nice-route',
            'User-Agent': 'Probably not Mozilla really',
          },
        },
      },
    },
    'with referer header': {
      data: {
        request: {
          url:
            'https://not-a-real-tenant.example.com/account/email-verification/long-verification-token',
          headers: {
            Referer:
              'https://not-a-real-tenant.example.com/account/email-verification/long-verification-token',
            'User-Agent': 'Probably not Mozilla really',
          },
        },
      },
    },
    'without headers': {
      data: {
        request: {
          url: 'https://not-a-real-tenant.example.com/nice-route',
        },
      },
    },
    'without request object': {
      data: {
        otherField: 'blue',
      },
    },
  },
);

describe('.isApiError', () => {
  it('returns true with SparkpostApiError', () => {
    const data = {
      exception: {
        values: [
          {
            type: 'SparkpostApiError',
          },
        ],
      },
    };

    expect(isApiError(data)).toEqual(true);
  });

  it('returns true with ZuoraApiError', () => {
    const data = {
      exception: {
        values: [
          {
            type: 'ZuoraApiError',
          },
        ],
      },
    };

    expect(isApiError(data)).toEqual(true);
  });

  it('returns false with TypeError', () => {
    const data = {
      exception: {
        values: [
          {
            type: 'TypeError',
          },
        ],
      },
    };

    expect(isApiError(data)).toEqual(false);
  });
});

describe('.isChunkFailure', () => {
  it('returns true with a chunk loading error', () => {
    const data = {
      exception: {
        values: [
          {
            value: 'Loading chunk 5 failed.',
          },
        ],
      },
    };

    expect(isChunkFailure(data)).toEqual(true);
  });

  it('returns false with another error', () => {
    const data = {
      exception: {
        values: [
          {
            value: 'Network Error',
          },
        ],
      },
    };

    expect(isChunkFailure(data)).toEqual(false);
  });
});

describe('.isErrorFromOurBundle', () => {
  it('returns true with error from our bundle', () => {
    const data = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                { filename: 'https://app.sparkpost.com/static/js/bundle.js', function: 'render' },
              ],
            },
          },
        ],
      },
    };

    expect(isErrorFromOurBundle(data)).toEqual(true);
  });

  it('returns true with error from our bundle when running locally', () => {
    const data = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                {
                  filename: 'http://app.sparkpost.test/4.a0803f8355f692de1382.hot-update.js',
                  function: 'render',
                },
              ],
            },
          },
        ],
      },
    };

    expect(isErrorFromOurBundle(data)).toEqual(true);
  });

  it('returns true with error from a native function called from our bundle', () => {
    const data = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                { filename: 'https://app.sparkpost.com/static/js/bundle.js', function: 'render' },
                { filename: '<anonymous>', function: 'Object.stringify' },
              ],
            },
          },
        ],
      },
    };

    expect(isErrorFromOurBundle(data)).toEqual(true);
  });

  it('returns false with error from other source', () => {
    const data = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                {
                  filename: 'chrome-extension://klkagjiegnnaknmfkmkbnjpmifplpiak/bull.js',
                  function: 'steal',
                },
              ],
            },
          },
        ],
      },
    };

    expect(isErrorFromOurBundle(data)).toEqual(false);
  });

  it('ignores raven-js frames and returns false with error from other source', () => {
    const data = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                {
                  filename: 'https://app.sparkpost.com/static/js/bundle.js',
                  function: 'HTMLDocument.wrapped',
                },
                {
                  filename: 'chrome-extension://klkagjiegnnaknmfkmkbnjpmifplpiak/bull.js',
                  function: 'steal',
                },
              ],
            },
          },
        ],
      },
    };

    expect(isErrorFromOurBundle(data)).toEqual(false);
  });

  it('returns false with exceptionless error', () => {
    const data = {
      exception: {
        values: [],
      },
    };

    expect(isErrorFromOurBundle(data)).toEqual(false);
  });
});

describe('.install', () => {
  let config;
  const store = jest.fn();

  beforeEach(() => {
    config = jest.spyOn(mockRaven, 'config').mockReturnThis();
  });

  it('does nothing when not configured', () => {
    ErrorTracker.install({}, store);
    expect(config).not.toHaveBeenCalled();
  });

  it('installs error tracking service with configuration', () => {
    ErrorTracker.install({ sentry: {} }, store);
    expect(config).toHaveBeenCalled();
  });
});

describe('.addRequestContextAndThrow', () => {
  let context;
  let isSetup;
  const error = new Error('Oh no!');

  beforeEach(() => {
    context = jest.spyOn(mockRaven, 'context');
    isSetup = jest.spyOn(mockRaven, 'isSetup');
  });

  it('simply throws the error when Raven is not configured', () => {
    isSetup.mockReturnValue(false);
    expect(() =>
      ErrorTracker.addRequestContextAndThrow({ test: 'abc', abc: 'test' }, error),
    ).toThrow();
    expect(context).not.toHaveBeenCalled();
  });

  it('adds tags to the context when throwing', () => {
    isSetup.mockReturnValue(true);
    const mockResponse = {
      status: 404,
    };
    ErrorTracker.addRequestContextAndThrow('MOCK_REDUX_ACTION', mockResponse, error);
    expect(context).toHaveBeenCalledWith(
      {
        tags: {
          reduxActionType: 'MOCK_REDUX_ACTION',
          httpResponseStatus: 404,
          zuoraErrorCodes: '',
        },
      },
      expect.any(Function),
    );
  });

  it('adds tags to the context when throwing and uses a 0 response status when no response is given', () => {
    isSetup.mockReturnValue(true);
    const mockResponse = {};
    ErrorTracker.addRequestContextAndThrow('MOCK_REDUX_ACTION', mockResponse, error);
    expect(context).toHaveBeenCalledWith(
      {
        tags: {
          reduxActionType: 'MOCK_REDUX_ACTION',
          httpResponseStatus: 0,
          zuoraErrorCodes: '',
        },
      },
      expect.any(Function),
    );
  });
});

describe('.report', () => {
  let captureException;
  let isSetup;
  const error = new Error('Oh no!');

  beforeEach(() => {
    captureException = jest.spyOn(mockRaven, 'captureException');
    isSetup = jest.spyOn(mockRaven, 'isSetup');
  });

  it('does nothing when not setup', () => {
    isSetup.mockReturnValue(false);
    ErrorTracker.report('test-logger', error);
    expect(captureException).not.toHaveBeenCalled();
  });

  it('sends error when setup', () => {
    isSetup.mockReturnValue(true);
    ErrorTracker.report('test-logger', error);
    expect(captureException).toHaveBeenCalledWith(error, { logger: 'test-logger', extra: {} });
  });

  it('sends extra data', () => {
    ErrorTracker.report('test-logger', error, { foo: 'bar' });
    expect(captureException).toHaveBeenCalledWith(error, {
      logger: 'test-logger',
      extra: { foo: 'bar' },
    });
  });
});
