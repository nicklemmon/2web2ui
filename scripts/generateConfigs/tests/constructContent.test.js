const constructContent = require('../constructContent');

const EXPECTED_CONTENT = `window.SP = window.SP || {};
window.SP.productionConfig = { apiBase: '//api.test.example/graphql' };
`;

describe('generateConfigs.constructContent', () => {
  it('returns configuration as a string of javascript', () => {
    const config = {
      alias: 'anotherTestTenant',
      host: 'test.example.com',
      tenantId: 'testTenant',
      apiBase: '//api.test.example/graphql'
    };

    expect(constructContent(config)).toEqual(EXPECTED_CONTENT);
  });
});
