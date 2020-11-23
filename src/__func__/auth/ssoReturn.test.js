import mountRoute from 'src/__testHelpers__/mountRoute';

const SSOEncodedToken = Buffer.from(
  JSON.stringify({ username: 'sso-username', accessToken: 'mock-access-token' }),
).toString('base64');

test('Single sign-on flow: return from identity provider', async () => {
  const page = await mountRoute(`/sso?ad=${SSOEncodedToken}`, { authenticated: false });
  expect(page.currentRoute()).toEqual('/dashboard');
  expect(page.mockApiCalls).toMatchSnapshot();
});
